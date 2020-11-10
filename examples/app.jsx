// @ts-check
/** @jsx Choc.create */
import Choc from "../module.js"
import Router from "./app/components/router.js"
import Navigation from "./app/components/navigation.js"

const App = (
    <div id="app">
        { Navigation }
        <div id="content">
            { Router }
        </div>
    </div>
)

App.mount(document.getElementById("app"))