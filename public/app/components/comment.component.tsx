import Doc, { reference, observable } from "../../mod/doc/mod"
import * as UserService from "../services/user.service"
import * as µ from "./mu.component"
import i18n from "../../lang/de_DE.json"
import * as PostService from "../services/post.service"
import * as NotificationService from "../services/notification.service"
import { randomColor } from "../helpers/colors"

export function Comments({ postId }: { postId: number }) {
  const TextAreaRef = reference<HTMLTextAreaElement>()
  const comments = observable<CommentModel[]>([])
  const hasComments = observable<boolean>(false)
  loadComments()

  return (
    <div interval={[loadComments, 30000]}>
      <div if={UserService.isUser}>
        <µ.Seperator />
        <form onsubmit={tryComment} styles={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <µ.TextArea ref={TextAreaRef} />
          <µ.Button type="submit" styles={{ width: "max-content" }}>{i18n.actionComment}</µ.Button>
        </form>
      </div>

      <div if={hasComments}>
        <µ.Seperator />
        <div className="comments" for={{ of: comments, do: Comment, sort: PostService.sort }} />
      </div>
    </div>
  ) as HTMLDivElement

  async function tryComment(event: Event) {
    event.preventDefault()
    const value = TextAreaRef.current.value
    if (!UserService.isUser.value()) {
      NotificationService.push(null, i18n.authError)
      return
    }
    if (!value || value.length < 4) {
      return NotificationService.push(null, i18n.messageCriteriaError)
    }
    let result = await PostService.addComment(postId, value)
    if (result) {
      TextAreaRef.current.value = ""
      loadComments()
    }
  }

  function loadComments() {
    PostService.loadComments(postId).then($ => {
      comments.set($)
      hasComments.set($.length > 0)
    })
  }
}

export function Comment(props: CommentModel) {
  const Owner = UserService.currentUser()?.username === props.user.alias

  const View = (
    <div className="comment">
      <div className="comment-flex" styles={{ flexDirection: Owner ? "row-reverse" : "row" }}>
        <div className="user-image" user-card={props.user.alias} styles={{ backgroundColor: randomColor() + " !important" }} />
        <µ.Box arrow={Owner ? "top-right" : "top-left"}>
          <div className="top">
            <div className="comment-author">
              {props.user.alias}
            </div>
            <µ.Time datetime={props.datePosted * 1000} className="datetime" />
          </div>
          <div>
            {props.textContent}
          </div>
          <div if={Owner} styles={{ position: "absolute", bottom: "0px", right: "0px" }}>
            <µ.Icon name="x-red" className="cursor-pointer" onclick={delComment} />
          </div>
        </µ.Box>
      </div>
    </div>
  ) as HTMLDivElement

  return View

  async function delComment() {
    let result = await PostService.delComment(props.id)
    if (result) {
      NotificationService.push(null, i18n.deleteCommentSuccess)
      View.remove()
    }
    else {
      NotificationService.push(null, i18n.deleteCommentFailure)
    }
  }
}