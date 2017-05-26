/**
 * Created by dante on 16-4-19.
 */
function can(obj, methodName) {
    return ((typeof obj[methodName]) == "function");
}

// 动态调用js对象函数
if (can(someObject, "quack")) {
    someObject.quack();
}