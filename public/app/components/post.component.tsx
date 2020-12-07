import Doc, { useRef, useState } from "../../mod/doc/mod"
import UserService from "../services/user.service"
import * as µ from "./mu.component"
import translateMarkDown from "../helpers/mark-down"
import PostService from "../services/post.service"
import onScreen from "../helpers/onscreen"

export default function Post(post: PostModel) {
  const PostRef = useRef<HTMLDivElement>()
  const visible = useState<string>("post opacity-0")

  return (
    <div className={visible} ref={PostRef} interval={[intervalFn, 250]}>
      <div styles={{ display: "flex", gap: "8px" }}>
        <div user-card={post.user.alias}>
          <div className="user-image-wrap">
            <div className="user-image" />
            <div className="avatar-circle" />
          </div>
        </div>
        <µ.Box className="post-content" arrow="top-left">
          <µ.Header>
            <div>
              {post.user.displayName}
              <span className="user-alias">
                @{post.user.alias}
              </span>
            </div>
            <µ.Time datetime={post.datePosted * 1000} className="datetime" />
            <µ.Icon name="calendar" />
          </µ.Header>
          <div className="user-content">
            <TextContainer postId={post.id} data={post.textContent} />
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", gap: "8px" }}>
              <HeartContainer likeAmount={post.likeAmount} postId={post.id} />
              <CommentContainer userAlias={post.user.alias} postId={post.id} />
              <µ.Icon name="menu-meatballs" className="post-menu" />
            </div>
          </µ.Footer>
        </µ.Box>
      </div>
    </div>
  ) as HTMLDivElement

  function intervalFn(el: HTMLElement) {
    visible.set(`post opacity-${onScreen(el) ? "1" : "0"}`)
  }
}

function TextContainer({ postId, data }: { postId: number, data: string }) {
  const Text = useState<string>(data)
  const MD = useState<string>("")
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
  const likes = useState(likeAmount)
  const HeartRef = useRef<µ.IconElement>()

  return (
    <div
      className="heart-action"
      styles={{ display: "flex", gap: "8px", alignItems: "center" }}
      if={UserService.isUser}
      mount={refreshFn}
      interval={[refreshFn, 1000]}
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
    <a href={`/user/${userAlias}/post/${postId}`} className="comment-action">
      <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <µ.Icon name="comment-bubbles-grey" className="post-comment" />
        <span>0</span>
      </div>
    </a>
  ) as HTMLAnchorElement
}