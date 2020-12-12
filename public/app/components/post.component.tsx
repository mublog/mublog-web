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
              <span className="user-alias">
                @{props.user.alias}
              </span>
            </div>
            <µ.Time datetime={props.datePosted * 1000} className="datetime" />
            <µ.Icon name="calendar" />
          </µ.Header>
          <div className="user-content">
            <TextContainer postId={props.id} data={props.textContent} />
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <HeartContainer likeAmount={props.likeAmount} postId={props.id} />
              <CommentContainer userAlias={props.user.alias} postId={props.id} />
              <div className="post-menu" tooltip={i18n.showPostMenu}>
                <µ.Icon if={UserService.isUser} name="menu-meatballs" onclick={MenuPortal.open} />
              </div>
              <span styles={{ position: "absolute", bottom: "0", right: "0" }}>
                <div portal={MenuPortal} />
                <div portal={DeletePostPortal} />
              </span>
            </div>
          </µ.Footer>
          <div if={!!props.showComments}>
            <µ.Seperator />
            <div className="comments">
              <Comment
                id={1}
                user={{ alias: "anton" } as User}
                datePosted={Date.now()}
                dateEdited={Date.now()}
                textContent="tschööööh"
              />
              <Comment
                id={2}
                user={{ alias: "iljushka" } as User}
                datePosted={Date.now()}
                dateEdited={Date.now()}
                textContent="hi :3"
              />
              <Comment
                id={3}
                user={{ alias: "anton" } as User}
                datePosted={Date.now()}
                dateEdited={Date.now()}
                textContent={"Lorem ipsun\nthe fuck wtf xD\nlol was"}
              />
              <Comment
                id={4}
                user={{ alias: "anton" } as User}
                datePosted={Date.now()}
                dateEdited={Date.now()}
                textContent={"löl"}
              />
            </div>
          </div>
        </µ.Box>
      </div>
    </div>
  ) as HTMLDivElement

  function PostMenu() {
    const Owner = UserService.currentUser()?.username === props.user.alias
    return (
      <µ.Menu onmouseleave={MenuPortal.close}>
        <µ.MenuItem if={Owner}>
          {i18n.editPost}
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

function Comment(props: CommentModel) {
  const Owner = UserService.currentUser()?.username === props.user.alias
  return (
    <div className="comment">
      <div className="comment-flex" styles={{ flexDirection: Owner ? "row-reverse" : "row" }}>
        <div className="user-image" user-card={props.user.alias} />
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

function CommentContainer({ userAlias, postId }: { userAlias: string, postId: number }) {
  return (
    <a href={`/user/${userAlias}/post/${postId}`} className="comment-action" tooltip={i18n.showComments}>
      <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <µ.Icon name="comment-bubbles-grey" className="post-comment" />
        <span>0</span>
      </div>
    </a>
  ) as HTMLAnchorElement
}