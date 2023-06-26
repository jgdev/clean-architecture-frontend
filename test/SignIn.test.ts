import { mount } from "@vue/test-utils";
import SignIn from "../src/components/SignIn.vue";
import { FetchAction } from "../src/types";

describe("SignIn", () => {
  test("should render properly", () => {
    const authSession = {};

    const wrapper = mount(SignIn, {
      props: {
        authSession,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should disable inputs and buttons on loading", async () => {
    const authSession = {
      loading: true,
    };

    const wrapper = mount(SignIn, {
      props: {
        authSession,
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    const inputEmail = wrapper.find('input[type="email"]');
    const inputPassword = wrapper.find('input[type="password"]');

    expect(submitButton.text()).toBe("Please wait ...");

    expect(submitButton.attributes()).toHaveProperty("disabled");
    expect(inputEmail.attributes()).toHaveProperty("disabled");
    expect(inputPassword.attributes()).toHaveProperty("disabled");
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should call login method on submit", async () => {
    const authSession = {
      loading: false,
      postAction: async () => {},
    } as FetchAction<string>;

    const loginSpy = vi.spyOn(authSession, "postAction");

    const wrapper = mount(SignIn, {
      props: {
        authSession,
      },
    });

    const inputEmail = wrapper.find('input[type="email"]');
    const inputPassword = wrapper.find('input[type="password"]');

    await inputEmail.setValue("test@test");
    await inputPassword.setValue("test123");

    await wrapper.find("form").trigger("submit");

    expect(loginSpy).toHaveBeenNthCalledWith(1, {
      data: {
        email: "test@test",
        password: "test123",
      },
    });
  });

  test("should display error properly", async () => {
    const authSession = {
      loading: false,
      error: "Test error",
    } as FetchAction<string>;

    const wrapper = mount(SignIn, {
      props: {
        authSession,
      },
    });

    const error = wrapper.find("h3");

    expect(error.text()).toBe("Test error");

    expect(wrapper.html()).toMatchSnapshot();
  });
});
