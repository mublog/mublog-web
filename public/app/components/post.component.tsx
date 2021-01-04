import Doc, { reference, observable, portal } from "../../mod/doc/mod"
import * as UserService from "../services/user.service"
import * as µ from "./mu.component"
import i18n from "../../lang/de_DE.json"
import translateMarkDown from "../helpers/mark-down"
import * as PostService from "../services/post.service"
import onScreen from "../helpers/onscreen"
import { randomColor } from "../helpers/colors"

export default function Post(props: PostModel) {
  const visible = observable<string>("post opacity-0")
  const MenuPortal = portal(PostMenu)
  const DeletePostPortal = portal(DeletePostMenu)

  return (
    <div className={visible} interval={[intervalFn, 250]}>
      <div styles={{ display: "flex", gap: "8px" }}>
        <div>
          <div className="user-image-wrap" user-card={props.user.alias}>
            <div className="user-image" styles={{ backgroundColor: randomColor() + " !important" }} />
            <div className="avatar-circle" />
          </div>
        </div>
        <µ.Box className="post-content" arrow="top-left">
          <µ.Header>
            <div>
              {props.user.displayName}
              <span className="user-alias">@{props.user.alias}</span>
            </div>
            <µ.Time datetime={props.datePosted * 1000} className="datetime" />
            <span if={props.datePosted !== props.dateEdited} tooltip={i18n.edited}>*</span>
            <µ.Icon name="calendar" />
          </µ.Header>
          <div className="user-content">
            <TextContainer postId={props.id} data={props.textContent} />
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <HeartContainer likeAmount={props.likeAmount} postId={props.id} />
              <CommentContainer userAlias={props.user.alias} postId={props.id} commentsAmount={props.commentsAmount} />
              <div className="post-menu" tooltip={i18n.showPostMenu}>
                <µ.Icon if={UserService.isUser} name="menu-meatballs" onclick={MenuPortal.open} />
              </div>
              <span styles={{ position: "absolute", bottom: "0", right: "0" }}>
                <div portal={MenuPortal} />
                <div portal={DeletePostPortal} />
              </span>
            </div>
          </µ.Footer>
          {!props.showComments ? undefined : <Comments postId={props.id} />}
        </µ.Box>
      </div>
    </div>
  ) as HTMLDivElement

  function PostMenu() {
    const Owner = UserService.currentUser()?.username === props.user.alias

    /**
     * editbutton:
     * <µ.MenuItem if={Owner}>
     *   {i18n.editPost}
     * </µ.MenuItem>
     */

    return (
      <µ.Menu onmouseleave={MenuPortal.close}>
        <µ.MenuItem>
          <a href={`/user/${props.user.alias}/post/${props.id}`}>
            {i18n.comments}
          </a>
        </µ.MenuItem>
        <µ.MenuItem if={Owner} onclick={DeletePostPortal.open}>
          {i18n.deletePost}
        </µ.MenuItem>
      </µ.Menu>
    ) as HTMLUListElement
  }

  function DeletePostMenu() {
    return (
      <µ.Menu onmouseleave={firstMenu}>
        <µ.Header>{i18n.deletePostSure}</µ.Header>
        <div styles={{ margin: "0 auto", width: "max-content" }}>
          <div styles={{ display: "flex", gap: "8px" }}>
            <µ.Button onclick={() => PostService.del(props.id)}>
              {i18n.continue}
            </µ.Button>
            <µ.Button onclick={firstMenu}>
              {i18n.abort}
            </µ.Button>
          </div>
        </div>
      </µ.Menu>
    ) as HTMLUListElement
  }

  function intervalFn(el: HTMLElement) {
    visible.set(`post opacity-${onScreen(el) ? "1" : "0"}`)
  }

  function firstMenu() {
    DeletePostPortal.close()
    MenuPortal.open(null)
  }
}

function Comments({ postId }: { postId: number }) {
  const TextAreaRef = reference<HTMLTextAreaElement>()
  const comments = observable([] as CommentModel[])
  loadComments()

  return (
    <div interval={[loadComments, 10000]}>
      <µ.Seperator />
      <form onsubmit={tryComment} styles={{ display: "flex", gap: "8px", flexDirection: "column" }}>
        <µ.TextArea ref={TextAreaRef} />
        <µ.Button type="submit" styles={{ width: "max-content" }}>{i18n.send}</µ.Button>
      </form>
      <µ.Seperator />
      <div className="comments" for={{ of: comments, do: Comment, sort: PostService.sort }} />
    </div>
  ) as HTMLDivElement

  async function tryComment(event: Event) {
    event.preventDefault()
    const value = TextAreaRef.current.value
    let result = await PostService.addComment(postId, value)
    if (result) {
      TextAreaRef.current.value = ""
      loadComments()
    }
  }

  function loadComments() {
    PostService.loadComments(postId).then($ => comments.set($))
  }
}

function Comment(props: CommentModel) {
  const Owner = UserService.currentUser()?.username === props.user.alias
  return (
    <div className="comment">
      <div className="comment-flex" styles={{ flexDirection: Owner ? "row-reverse" : "row" }}>
        <div className="user-image" user-card={props.user.alias} styles={{ backgroundColor: randomColor() + " !important" }} />
        <µ.Box arrow={Owner ? "top-right" : "top-left"}>
          <div className="comment-author">
            {props.user.alias}
          </div>
          {props.textContent}
        </µ.Box>
      </div>
    </div>
  ) as HTMLDivElement
}

function TextContainer({ postId, data }: { postId: number, data: string }) {
  const Text = observable<string>(data)
  const MD = observable<string>("")
  Text.subscribe(txt => MD.set(translateMarkDown(txt)))

  return (
    <µ.Box className="text-content" interval={[refreshFn, 10000]}>
      <div innerHTML={MD} className="mark-down" />
    </µ.Box>
  ) as HTMLDivElement

  function refreshFn(el: HTMLElement) {
    if (!onScreen(el)) return
    let post = PostService.localById(postId)
    if (!post) return
    Text.set(post.textContent)
  }
}

function HeartContainer({ likeAmount, postId }: { likeAmount: number, postId: number }) {
  const likes = observable(likeAmount)
  const HeartRef = reference<µ.IconElement>()

  return (
    <div
      className="heart-action"
      styles={{ display: "flex", gap: "8px", alignItems: "center" }}
      if={UserService.isUser}
      mount={refreshFn}
      interval={[refreshFn, 250]}
      tooltip={[likes, i18n.nUsersLikedThat]}
    >
      <µ.Icon
        ref={HeartRef}
        name="heart-grey"
        onclick={() => PostService.like(postId)}
        className="wiggle-vertical"
        styles={{ cursor: "pointer" }}
      />
      <span>{likes}</span>
    </div>
  ) as HTMLDivElement

  function refreshFn(el: HTMLElement) {
    if (!onScreen(el) && UserService.isUser.value()) return
    let post = PostService.localById(postId)
    if (!post) return
    likes.set(post.likeAmount)
    HeartRef.current.setIcon(post.liked ? "heart-red" : "heart-grey")
  }
}

function CommentContainer({ userAlias, postId, commentsAmount }: { userAlias: string, postId: number, commentsAmount: number }) {
  const comments = observable(commentsAmount)

  return (
    <a
      href={`/user/${userAlias}/post/${postId}`}
      className="comment-action"
      tooltip={i18n.showComments}
      interval={[refreshFn, 250]}
    >
      <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <µ.Icon name="comment-bubbles-grey" className="post-comment" />
        <span>{comments}</span>
      </div>
    </a>
  ) as HTMLAnchorElement

  function refreshFn(el: HTMLElement) {
    if (!onScreen(el) && UserService.isUser.value()) return
    let post = PostService.localById(postId)
    if (!post) return
    comments.set(post.commentsAmount)
  }
}