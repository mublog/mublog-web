import Doc, { onInterval, onMount, useRef, useState } from "../../mod/doc/mod"
import UserService from "../services/user.service"
import * as µ from "./mu.component"
import translateMarkDown from "../helpers/mark-down"
import PostService from "../services/post.service"
import onScreen from "../helpers/onscreen"

export default function Post(post: PostModel) {
  const PostRef = useRef<HTMLDivElement>()
  const visible = useState<string>("post opacity-0")

  const View = (
    <div className={visible} ref={PostRef}>
      <div styles={{ display: "flex", gap: "8px" }}>
        <UserImageContainer userAlias={post.user.alias} userImageUrl={post.user.profileImageId} />
        <µ.Box className="post-content" arrow="top-left">
          <µ.Header>
            <UserContainer userAlias={post.user.alias} userName={post.user.displayName} />
            <µ.Time datetime={post.datePosted} className="datetime" />
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
  onInterval(() => visible.set(`post opacity-${onScreen(View) ? "1" : "0"}`), 250)
  return View
}

function UserContainer({ userAlias, userName }) {
  let UserName = useState(userName)
  return (
    <div user-card={userAlias}>
      {UserName}
      <span className="user-alias">
        @{userAlias}
      </span>
    </div>
  ) as HTMLDivElement
}

function UserImageContainer({ userAlias, userImageUrl }: { userAlias: string, userImageUrl: string }) {
  //  styles={{ backgroundImage: `url(${userImageUrl})` }}
  return (
    <div user-card={userAlias}>
      <div className="user-image-wrap">
        <div className="user-image" />
        <div className="avatar-circle" />
      </div>
    </div>
  ) as HTMLDivElement
}

function TextContainer({ postId, data }: { postId: number, data: string }) {
  const Text = useState<string>(data)
  const MD = useState<string>("")
  Text.subscribe(txt => MD.set(translateMarkDown(txt)))

  const View = (
    <µ.Box className="text-content">
      <div innerHTML={MD} className="mark-down" />
    </µ.Box>
  ) as HTMLDivElement

  onInterval(refresh, 10000)

  return View

  function refresh() {
    if (!onScreen(View)) return
    let post = PostService.localById(postId)
    if (!post) return
    Text.set(post.textContent)
  }
}

function HeartContainer({ likeAmount, postId }: { likeAmount: number, postId: number }) {
  const likes = useState(likeAmount)
  const HeartRef = useRef<µ.IconElement>()

  const View = (
    <div className="heart-action" styles={{ display: "flex", gap: "8px", alignItems: "center" }} if={UserService.isUser}>
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

  onMount(refresh)
  onInterval(refresh, 1000)

  return View

  function refresh() {
    if (!onScreen(View) && UserService.isUser.value()) return
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
        <span>comments</span>
      </div>
    </a>
  ) as HTMLAnchorElement
}