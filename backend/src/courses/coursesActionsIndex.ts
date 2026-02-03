import coursesCrud from "./coursesCrud";
import coursesRead from "./coursesRead";
import coursesSignup from "./coursesSignup";
import coursesMaterial from "./coursesMaterial";
import coursesComments from "./coursesComments";

export default {
    ...coursesCrud,
    ...coursesRead,
    ...coursesSignup,
    ...coursesMaterial,
    ...coursesComments,
};
