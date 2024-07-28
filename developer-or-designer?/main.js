"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const devOrDesigner = new DevOrDesigner("#occupation");
});
class DevOrDesigner {
    /**
     * @param buttonEl CSS selector of the button to use
     */
    constructor(buttonEl) {
        var _a;
        this._occupation = "developer";
        this.button = document.querySelector(buttonEl);
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.occupationToggle.bind(this));
    }
    /** Selected occupation */
    get occupation() {
        return this._occupation;
    }
    set occupation(value) {
        var _a;
        this._occupation = value;
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.setAttribute("aria-labelledby", this._occupation);
    }
    /** Set the occupation to developer or designer. */
    occupationToggle() {
        this.occupation = this.occupation === "developer" ? "designer" : "developer";
    }
}
