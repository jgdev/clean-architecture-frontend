import { mount } from "@vue/test-utils";
import PerformOperation from "../src/components/PerformOperation.vue";
import {
  FetchAction,
  FetchResources,
  User,
  Record,
  Operation,
} from "../src/types";
import { createFakeAction, createFakeResources } from "./utils";

describe("PerformOperation", () => {
  let user: FetchAction<User>;
  let authSession: FetchAction<string>;
  let authLogout: FetchAction<void>;
  let records: FetchResources<Record>;
  let operations: FetchResources<Operation>;
  let deleteRecord: FetchAction<void>;
  let props = {};
  let onClose = vi.fn(() => Promise.resolve());
  let onSubmit = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    user = createFakeAction<User>({
      email: "test@test",
      balance: 200,
    });
    authSession = createFakeAction<string>();
    authLogout = createFakeAction<void>();
    records = createFakeResources<Record>();
    operations = createFakeResources<Operation>();
    props = {
      user,
      authSession,
      authLogout,
      records,
      operations,
      onClose,
      onSubmit,
    };
  });

  test("should render properly", () => {
    const wrapper = mount(PerformOperation, { props });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should disable controls while loading", async () => {
    const wrapper = mount(PerformOperation, { props });
    console.log(wrapper.find('button[type="submit"]').text());
    expect(wrapper.find("button").text()).toBe("Submit");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find('button[type="submit"]').text()).toBe("Performing ...");
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display addition operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit addition operation properly", () => {
    throw new Error("not implemented");
  });

  test("should display subtraction operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit subtraction operation properly", () => {
    throw new Error("not implemented");
  });

  test("should display multiplication operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit multiplication operation properly", () => {
    throw new Error("not implemented");
  });

  test("should display division operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit division operation properly", () => {
    throw new Error("not implemented");
  });

  test("should display square_root operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit square_root operation properly", () => {
    throw new Error("not implemented");
  });

  test("should display string_generator operation properly", () => {
    throw new Error("not implemented");
  });

  test("should submit string_generator operation properly", () => {
    throw new Error("not implemented");
  });
});
