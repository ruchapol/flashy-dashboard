/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
const router = useRouter();
const auth = useAuthStore();
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
async function onSubmit() {
    error.value = "";
    loading.value = true;
    try {
        await auth.register(username.value, email.value, password.value);
        await router.push("/");
    }
    catch (e) {
        error.value = e instanceof Error ? e.message : "Sign up failed";
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "auth-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.onSubmit) },
    ...{ class: "auth-form" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.username),
    type: "text",
    placeholder: "Username",
    required: true,
    minlength: "3",
    maxlength: "32",
    autocomplete: "username",
    ...{ class: "input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "email",
    placeholder: "Email",
    required: true,
    autocomplete: "email",
    ...{ class: "input" },
});
(__VLS_ctx.email);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "password",
    placeholder: "Password (min 8 characters)",
    required: true,
    minlength: "8",
    autocomplete: "new-password",
    ...{ class: "input" },
});
(__VLS_ctx.password);
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "submit-btn" },
    disabled: (__VLS_ctx.loading),
});
(__VLS_ctx.loading ? "Creating account…" : "Sign up");
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "footer" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/login",
    ...{ class: "link" },
}));
const __VLS_2 = __VLS_1({
    to: "/login",
    ...{ class: "link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['auth-view']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-form']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            username: username,
            email: email,
            password: password,
            error: error,
            loading: loading,
            onSubmit: onSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
