import { selector } from "recoil";
import userState from "../atoms/users";

const userEmailState = selector({
  key: "userEmailState",
  get: ({ get }) => {
    const state = get(userState);
    return state.userEmail;
  },
});

export default userEmailState;