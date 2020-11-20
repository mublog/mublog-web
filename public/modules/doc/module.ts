import createElement from "./src/create-node"
import createText from "./src/create-text"
import useState from "./src/helpers/state"
import useMixin from "./src/helpers/mixin"
import createAnimation from "./src/helpers/animation"
import { useEvent, useEvents } from "./src/helpers/events"
import tagged from "./src/helpers/tagged"
import { mount, unmount } from "./src/helpers/mount"
import { queryAll, query } from "./src/helpers/query"
import { useStyles, useStyleGroup, createStyle } from "./src/helpers/styles"
import createRouter from "./src/extras/router/module"

import type { HTMLProperties, MappedElement } from "./src/create-node"
import type { State, Subscriber, Update } from "./src/helpers/state"
import type { KeyframeOptions } from "./src/helpers/animation"
import type { EventListener, EventObject } from "./src/helpers/events"

const Doc = {
    createElement,
    createText,
    createRouter,
    createStyle,
    createAnimation,
    queryAll,
    query
}

const h = createElement

export {
    useState,
    useMixin,
    useEvent,
    useEvents,
    tagged,
    mount,
    unmount,
    useStyles,
    useStyleGroup,
    queryAll,
    query,
    h,

    State,
    KeyframeOptions,
    EventListener,
    EventObject,
    Subscriber,
    Update,
    HTMLProperties,
    MappedElement
}

export default Doc