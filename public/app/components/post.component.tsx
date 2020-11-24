import { createElement, useRef, useState } from "../../modules/doc/mod"
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
            <div className="box text-content mark-down" innerHTML={translateMarkDown(post.textContent)} />
          </div>
          <div className="footer">
            <span className="seperator" />
            <div className="footer-content">
              <div styles={{ display: "flex", gap: "8px" }}>
                <HeartContainer heartAmount={post.likeAmount} postId={post.id} heartNames={post.likeNames} />
                <CommentContainer userAlias={post.user.alias} postId={post.id} />
                <µ.Icon name="menu-meatballs" className="post-menu" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeartContainer({ heartAmount, postId, heartNames }): HTMLDivElement {
  const hearts = useState(heartAmount)
  const HeartRefs = [useRef<µ.IconElement>(), useRef<µ.IconElement>()]
  return (
    <div className="heart-action" styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <µ.Icon ref={HeartRefs[0]} name="heart-grey" if={UserService.isUser} className="post-like clickable cursor-action" onclick={like} />
      <µ.Icon ref={HeartRefs[1]} name="heart-grey" if={UserService.isGuest} className="post-like cursor-disabled" />
      <span>{hearts}</span>
    </div>
  )
  function like() {
    PostService.getPosts().updateOne($ => $.id === postId, $ => {
      let idx = heartNames.indexOf(UserService.currentUser().alias)
      if (idx >= 0) {
        heartNames.splice(idx, 1)
        HeartRefs.forEach(heartRef => heartRef.get().setIcon("heart-grey"))
      }
      else {
        heartNames.push(UserService.currentUser().alias)
        HeartRefs.forEach(heartRef => heartRef.get().setIcon("heart-red"))
      }
      hearts.set(heartNames.length)
      $.likeNames = heartNames
      $.likeAmount = heartNames.length
      return $
    })
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