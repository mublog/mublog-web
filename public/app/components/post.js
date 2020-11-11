// @ts-check
import Box, { Seperator, Title, Arrow, Header, Footer } from "../components/box.js"
import Flex from "../components/flex.js"
import Time from "../components/time.js"
import { Div, Span, Route, Icon } from "../components/generic.js"
import Choc from "../../../modules/choc/module.js"

export default function Post({ 
    id,
    user: {
        alias,
        name,
        profileImageUrl
    },
    textContent,
    likeAmount,
    datePosted,
    dateEdited
}) {
    let component = Div({ id: `post-${id}`, className: "post" },
        Flex({ gap: "8px" },
            Route({ href: `/user/${alias}`, className: "user-image-wrap" },
                Div({ className: "user-image" }).style({ backgroundImage: `url("${profileImageUrl}")`}),
                Div({ className: "user-image-frame" })
            ),
            Box({ className: "post-content" },
                Arrow("top-left"),
                Header({ },
                    Route({ href: `/user/${alias}`, className: "user-link" },
                        Flex({ gap: "8px", className: "user" },
                            Span({ className: "user-name" }, name),
                            Span({ className: "user-alias" }, alias)
                        )
                    ),
                    Time({ dateTime: datePosted, title: dateEdited, className: "datetime" }),
                    Icon("calendar")  
                ),
                Div({ className: "user-content" },
                    Box({ className: "text-content" }, textContent)
                ),
                Footer({ },
                    Flex({ gap: "8px" },
                        Flex({ gap: "8px", alignItems: "center" },
                            Icon("heart-grey", { className: "post-like" }),
                            Span({ innerText: likeAmount })
                                .addEvent("click", n => n.set("innerText", ++likeAmount))
                        ),
                        Icon("menu-meatballs", { className: "post-menu" })
                    )
                )
            )
        )
    )
    return component
}