import { atom } from "recoil";

const courseState = atom({
    key : "courseState",
    default : {
        course : {},
        isLoading : true,
        isEditing : false
    }
});

export default courseState;