import Doc, { onInterval, onMount, useRef, useState } from "../../modules/doc/mod"
import UserService from "../services/user.service"
import * as µ from "./mu.component"
import translateMarkDown from "../helpers/mark-down"
import PostService from "../services/post.service"
import onScreen from "../helpers/onscreen"
import UserCardPortal from "./user-card.component"

export default function Post(post: PostModel) {
  const PostRef = useRef<HTMLDivElement>()
  const visible = useState<string>("post opacity-0")

  const View = (
    <div className={visible} ref={PostRef}>
      <div styles={{ display: "flex", gap: "8px" }}>
        <UserImageContainer userAlias={post.user.alias} userImageUrl={post.user.imageUrl} />
        <µ.Box className="post-content" arrow="top-left">
          <µ.Header>
            <UserContainer userAlias={post.user.alias} userName={post.user.name} />
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

  onInterval(() => visible.set(`post opacity-${onScreen(View) ? "1" : "0"}`), 100)

  return View
}

function UserContainer({ userAlias, userName }) {
  let UserName = useState(userName)
  return (
    <a className="user-link" href={`/user/${userAlias}`}>
      {UserName}
      <span className="user-alias">
        @{userAlias}
      </span>
    </a>
  ) as HTMLAnchorElement
}

function UserImageContainer({ userAlias, userImageUrl }: { userAlias: string, userImageUrl: string }) {
  //  styles={{ backgroundImage: `url(${userImageUrl})` }}
  return (
    <div className="user-link" onmouseenter={openCard}>
      <div className="user-image-wrap">
        <div className="user-image" />
        <div className="user-image-frame" />
      </div>
    </div>
  ) as HTMLAnchorElement

  function openCard(event: MouseEvent) {
    UserCardPortal.open({
      alias: userAlias,
      top: event.clientY,
      left: event.clientX
    })
  }
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
    if (onScreen(View)) {
      let post = PostService.getPosts().find(({ id }) => id === postId)
      if (post && post.textContent && (post.textContent !== Text.get())) {
        Text.set(post.textContent)
      }
    }
  }
}

function HeartContainer({ likeAmount, postId }: { likeAmount: number, postId: number }) {
  const likes = useState(likeAmount)
  const HeartRefs = [useRef<µ.IconElement>(), useRef<µ.IconElement>()]

  const View = (
    <div className="heart-action" styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <µ.Icon
        ref={HeartRefs[0]}
        name="heart-grey"
        if={UserService.isUser}
        onclick={like}
        className="wiggle-vertical"
        styles={{ cursor: "pointer" }}
      />
      <µ.Icon ref={HeartRefs[1]} name="heart-grey" if={UserService.isGuest} />
      <span>{likes}</span>
    </div>
  ) as HTMLDivElement

  onMount(refresh)
  onInterval(refresh, 10000)

  return View

  function refresh() {
    if (onScreen(View)) {
      let post = PostService.getPosts().find(({ id }) => id === postId)
      likes.set(post.likeAmount)
      HeartRefs[0].current.setIcon(post.likedByUser ? "heart-red" : "heart-grey")
    }
  }

  function like() {
    PostService.getPosts().updateOne(post => post.id === postId, post => {
      post.likedByUser = post.likedByUser ? false : true
      post.likeAmount -= post.likedByUser ? -1 : +1
      refresh()
      return post
    })
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