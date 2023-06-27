import { mount } from "@vue/test-utils";
import { createFakeAction, createFakeResources } from "./utils";

import {
  FetchAction,
  FetchResources,
  Operation,
  Record,
  User,
} from "../src/types";

import Header from "../src/components/Header.vue";

describe("Header", () => {
  let user: FetchAction<User>;
  let authSession: FetchAction<string>;
  let authLogout: FetchAction<void>;
  let records: FetchResources<Record>;
  let operations: FetchResources<Operation>;
  let deleteRecord: FetchAction<void>;
  let onPerformOperation = vi.fn();

  beforeEach(() => {
    onPerformOperation = vi.fn();
    user = createFakeAction<User>({
      balance: 200,
      email: "test@test",
    });
    authSession = createFakeAction<string>();
    authLogout = createFakeAction<void>();
    deleteRecord = createFakeAction<void>();
    records = createFakeResources<Record>();
    operations = createFakeResources<Operation>();
  });

  it("should display user balance properly", () => {
    const wrapper = mount(Header, {
      props: {
        user,
        authLogout,
        authSession,
        records,
        onPerformOperation,
      },
    });
    expect(wrapper.text()).toMatch(/\$200.00/);
    expect(wrapper.find("svg#loading-user-balance").exists()).toBe(false);
    expect(wrapper.find("#user-balance").exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should hide balance and disable controls while loading profile", () => {
    user.loading = true;
    const wrapper = mount(Header, {
      props: {
        user,
        authLogout,
        authSession,
        records,
        onPerformOperation,
      },
    });
    expect(wrapper.find("svg#loading-user-balance").exists()).toBe(true);
    expect(wrapper.find("#user-balance").exists()).toBe(false);
    expect(wrapper.find("button").attributes()).toHaveProperty("disabled");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should handle perform new operation click", async () => {
    user.loading = false;
    const wrapper = mount(Header, {
      props: {
        user,
        authLogout,
        authSession,
        records,
        onPerformOperation,
      },
    });
    await wrapper.find("button").trigger("click");
    expect(onPerformOperation).toHaveBeenCalledOnce();
  });

  it("should handle logout", async () => {
    user.loading = false;
    const wrapper = mount(Header, {
      props: {
        user,
        authLogout,
        authSession,
        records,
        onPerformOperation,
      },
    });
    await wrapper.find("a").trigger("click");
    expect(authLogout.postAction).toHaveBeenCalledOnce();
  });
});
