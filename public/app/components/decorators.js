// @ts-check

/**
 * @template tag, props, com
 * @param {com & import("../../../modules/choc/module").default<tag, props>} com 
 */
export function isComment(com) {
    return {
        /**
         * @param {boolean} condition
         */
        if(condition) {
            if (condition) {
                // @ts-expect-error
                com.$el = document.createComment("hidden")
            }
            return com
        }
    }
}

/**
 * Adds Signal<"while", () => any> to the component.\
 * @template component
 * @param {component & import("../../../modules/choc/module").default} com
 */
export function loadingCircle(com) {
    return com.mixin({
        /** @param {() => any} task */
        async while(task) {
            com.nativeElement.classList.add("loading-circle")
            await task()
            com.nativeElement.classList.remove("loading-circle")
            return com
        }
    }).addSignal("while", (node, task) => node.while(task))
}