import { mount } from "@vue/test-utils";
import { randomUUID } from "crypto";
import PerformOperation from "../src/components/PerformOperation.vue";
import {
  FetchAction,
  FetchResources,
  User,
  Record,
  Operation,
  OperationType,
} from "../src/types";
import { createFakeAction, createFakeResources } from "./utils";

describe("PerformOperation", () => {
  let user: FetchAction<User>;
  let authSession: FetchAction<string>;
  let authLogout: FetchAction<void>;
  let records: FetchResources<Record>;
  let operations: FetchResources<Operation>;
  let onClose = vi.fn();
  let onSubmit = vi.fn(() => Promise.resolve());

  let props = {
    user,
    authSession,
    authLogout,
    records,
    operations,
    onClose,
    onSubmit,
  };

  beforeEach(() => {
    user = createFakeAction<User>({
      email: "test@test",
      balance: 200,
    });
    authSession = createFakeAction<string>();
    authLogout = createFakeAction<void>();
    records = createFakeResources<Record>();
    operations = createFakeResources<Operation>();
    onSubmit = vi.fn(() => Promise.resolve());
    onClose = vi.fn();
    props = {
      user,
      authSession,
      authLogout,
      records,
      operations,
      onClose,
      onSubmit,
    };
    (window as any).crypto = {
      randomUUID,
    };
  });

  test("should render properly", () => {
    const wrapper = mount(PerformOperation, { props });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should disable controls while loading", async () => {
    const wrapper = mount(PerformOperation, { props });
    expect(wrapper.find('button[type="submit"]').text()).toBe("Submit");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find('button[type="submit"]').text()).toBe("Performing ...");
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display error properly", async () => {
    props.operations.result = {
      result: [],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        mocks: {
          error: "Some error",
        },
      },
    });

    expect(wrapper.find(".error").text()).toBe("Some error");
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should add input arg", async () => {
    props.operations.result = {
      result: [
        { id: "some-id", name: "Some Operation", type: OperationType.ADDITION },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.ADDITION);
    await wrapper.find("select").trigger("change");

    expect(wrapper.findAll('form input[type="number"').length).toBe(2);

    await wrapper.find("a#add-input").trigger("click");

    expect(wrapper.findAll('form input[type="number"').length).toBe(3);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should remove input arg", async () => {
    props.operations.result = {
      result: [
        { id: "some-id", name: "Some Operation", type: OperationType.ADDITION },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.ADDITION);
    await wrapper.find("select").trigger("change");

    expect(wrapper.findAll('form input[type="number"').length).toBe(2);

    await wrapper.find("a#add-input").trigger("click");

    expect(wrapper.findAll('form input[type="number"').length).toBe(3);

    await wrapper.find(".remove-input-1").trigger("click");

    expect(wrapper.findAll('form input[type="number"').length).toBe(2);

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display addition operation properly", async () => {
    props.operations.result = {
      result: [
        { id: "some-id", name: "Some Operation", type: OperationType.ADDITION },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.ADDITION);
    await wrapper.find("select").trigger("change");

    const [input1, input2] = wrapper.findAll("form input");

    await input1.setValue(1);
    await input2.setValue(2);

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(OperationType.ADDITION, [1, 2]);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display subtraction operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.SUBTRACTION,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.SUBTRACTION);
    await wrapper.find("select").trigger("change");

    const [input1, input2] = wrapper.findAll("form input");

    await input1.setValue(1);
    await input2.setValue(1);

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(
      OperationType.SUBTRACTION,
      [1, 1]
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should submit multiplication operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.MULTIPLICATION,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.MULTIPLICATION);
    await wrapper.find("select").trigger("change");

    const [input1, input2] = wrapper.findAll("form input");

    await input1.setValue(1);
    await input2.setValue(1);

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(
      OperationType.MULTIPLICATION,
      [1, 1]
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should submit division operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.MULTIPLICATION,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.DIVISION);
    await wrapper.find("select").trigger("change");

    const [input1, input2] = wrapper.findAll("form input");

    await input1.setValue(1);
    await input2.setValue(1);

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(OperationType.DIVISION, [1, 1]);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should submit square_root operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.SQUARE_ROOT,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.SQUARE_ROOT);
    await wrapper.find("select").trigger("change");

    const [input1] = wrapper.findAll("form input");

    await input1.setValue(1);

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(OperationType.SQUARE_ROOT, [1]);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display random_string operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.RANDOM_STRING,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.RANDOM_STRING);
    await wrapper.find("select").trigger("change");

    const [input1] = wrapper.findAll("form input");

    await input1.setValue(20);

    const [_, secondInputCheck] = wrapper.findAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    secondInputCheck.setValue(false);
    await secondInputCheck.trigger("click");
    await secondInputCheck.trigger("change");

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(OperationType.RANDOM_STRING, [
      20,
      true,
      false,
      true,
      true,
      true,
    ]);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should submit string_generator_v2 operation properly", async () => {
    props.operations.result = {
      result: [
        {
          id: "some-id",
          name: "Some Operation",
          type: OperationType.RANDOM_STRING_V2,
        },
        {
          id: "some-id-2",
          name: "Some Operation",
          type: OperationType.DIVISION,
        },
      ],
      limit: 0,
      skip: 0,
      total: 1,
    };
    const wrapper = mount(PerformOperation, {
      props,
      global: {
        config: {
          warnHandler: () => null,
        },
      },
    });

    await wrapper.find("select").setValue(OperationType.RANDOM_STRING_V2);
    await wrapper.find("select").trigger("change");

    const [input1] = wrapper.findAll("form input");

    await input1.setValue(20);

    const [_, secondInputCheck] = wrapper.findAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    secondInputCheck.setValue(false);
    await secondInputCheck.trigger("click");
    await secondInputCheck.trigger("change");

    await wrapper.find('button[type="submit"]').trigger("click");

    expect(props.onSubmit).toHaveBeenCalledWith(
      OperationType.RANDOM_STRING_V2,
      [20, true, false, true, true, true]
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
