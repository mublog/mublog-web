import { createElement, onInterval, useRef, useState } from "../../modules/doc/mod"
import Time from "./time.component"
import UserService from "../services/user.service"
import * as µ from "./mu.component"
import translateMarkDown from "../helpers/mark-down"
import PostService from "../services/post.service"

export default function Post(post: PostModel): HTMLDivElement {
  return (
    <div className="post">
      <div styles={{ display: "flex", gap: "8px" }}>
        <a className="user-link" href={`/user/${post.user.alias}`}>
          <div className="user-image-wrap">
            <div className="user-image" />
            <div className="user-image-frame" />
          </div>
        </a>
        <div className="box post-content">
          <µ.Header>
            <a className="user-link" href={`/user/${post.user.alias}`}>
              <div className="user" styles={{ display: "flex", gap: "8px" }}>
                <span className="user-name">{post.user.name}</span>
                <span className="user-alias">{post.user.alias}</span>
              </div>
            </a>
            <Time datetime={post.datePosted} className="datetime" />
            <µ.Icon name="calendar" />
          </µ.Header>
          <div className="user-content">
            <TextContainer postId={post.id} text={post.textContent} />
          </div>
          <µ.Footer>
            <div styles={{ display: "flex", gap: "8px" }}>
              <HeartContainer likeAmount={post.likeAmount} postId={post.id} />
              <CommentContainer userAlias={post.user.alias} postId={post.id} />
              <µ.Icon name="menu-meatballs" className="post-menu" />
            </div>
          </µ.Footer>
        </div>
      </div>
    </div>
  )
}

function TextContainer({ postId, text }: { postId: number, text: string }) {
  const Text = useState<string>(text)
  const MD = useState<string>("")
  Text.subscribe(txt => MD.set(translateMarkDown(txt)))

  const View = (
    <div className="box text-content mark-down" innerHTML={MD} />
  )

  onInterval(refresh, 10000)

  return View

  function refresh() {
    let post = PostService.getPosts().find(({ id }) => id === postId)
    if (post && post.textContent && (post.textContent !== Text.get())) {
      Text.set(post.textContent)
    }
  }
}

function HeartContainer({ likeAmount, postId }: { likeAmount: number, postId: number }): HTMLDivElement {
  const likes = useState(likeAmount)
  const HeartRefs = [useRef<µ.IconElement>(), useRef<µ.IconElement>()]

  const View = (
    <div className="heart-action" styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <µ.Icon
        ref={HeartRefs[0]}
        name="heart-grey"
        if={UserService.isUser}
        className="post-like clickable cursor-action"
      />
      <µ.Icon
        ref={HeartRefs[1]}
        name="heart-grey"
        if={UserService.isGuest}
        className="post-like cursor-disabled"
      />
      <span>{likes}</span>
    </div>
  )

  onInterval(refresh, 10000)

  return View

  function refresh() {
    let post = PostService.getPosts().find(({ id }) => id === postId)
    likes.set(post.likeAmount)
  }
}

function CommentContainer({ userAlias, postId }: { userAlias: string, postId: number }): HTMLAnchorElement {
  return (
    <a href={`/user/${userAlias}/post/${postId}`} className="comment-action">
      <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <µ.Icon name="comment-bubbles-grey" className="post-comment" />
        <span>comments</span>
      </div>
    </a>
  )
}