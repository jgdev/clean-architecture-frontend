import { mount } from "@vue/test-utils";
import { randomUUID } from "crypto";
import { createFakeAction, createFakeResources } from "./utils";
import {
  FetchAction,
  FetchResources,
  Operation,
  OperationType,
  Record,
  User,
} from "../src/types";
import ListRecords from "../src/components/ListRecords.vue";
import { DEFAULT_RESULTS_LIMIT } from "../src/constants";

describe("ListRecords", () => {
  let user: FetchAction<User>;
  let authSession: FetchAction<string>;
  let authLogout: FetchAction<void>;
  let deleteRecord: FetchAction<void>;
  let records: FetchResources<Record>;
  let operations: FetchResources<Operation>;
  let onDeleteRecord = vi.fn();
  let onPerformOperation = vi.fn(() => Promise.resolve());

  let props = {
    user,
    authSession,
    authLogout,
    records,
    operations,
    onDeleteRecord,
    onPerformOperation,
    deleteRecord,
  };

  beforeEach(() => {
    user = createFakeAction<User>({
      email: "test@test",
      balance: 200,
    });
    authSession = createFakeAction<string>();
    authLogout = createFakeAction<void>();
    deleteRecord = createFakeAction<void>();
    records = createFakeResources<Record>();
    operations = createFakeResources<Operation>();
    onPerformOperation = vi.fn(() => Promise.resolve());
    onDeleteRecord = vi.fn();
    props = {
      user,
      authSession,
      authLogout,
      records,
      operations,
      onDeleteRecord,
      onPerformOperation,
      deleteRecord,
    };
    (window as any).crypto = {
      randomUUID,
    };
  });

  test("should render properly", () => {
    const wrapper = mount(ListRecords, {
      props,
    });
    expect(wrapper.text()).toMatch(/No records found/);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should display PerformOperation form", () => {
    const wrapper = mount(ListRecords, {
      props,
      global: {
        mocks: {
          performOperation: true,
        },
      },
    });
    expect(wrapper.find("#perform-operation-modal").exists()).toBe(true);

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should hide PerformOperation form", async () => {
    const wrapper = mount(ListRecords, {
      props,
      global: {
        mocks: {
          performOperation: true,
        },
      },
    });

    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.find("#perform-operation-modal").exists()).toBe(false);

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should render records properly", async () => {
    props.operations.result = {
      skip: 0,
      limit: 0,
      total: 1,
      result: [
        { id: "some-id", name: "Addition", type: OperationType.ADDITION },
      ],
    };
    props.records.result = {
      skip: 0,
      limit: 0,
      total: 1,
      result: [
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [50, 50],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.ADDITION,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.SUBTRACTION,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.MULTIPLICATION,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.DIVISION,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.SQUARE_ROOT,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.RANDOM_STRING,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.RANDOM_STRING_V2,
        },
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [],
          operationId: "some-id",
          operationResult: 100,
          operationType: "unsupported",
        },
      ],
    };

    const wrapper = mount(ListRecords, {
      props,
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should handle deletion properly", async () => {
    const spy = vi.spyOn(props, "onDeleteRecord");
    props.records.result = {
      skip: 0,
      limit: 0,
      total: 1,
      result: [
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [50, 50],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.ADDITION,
        },
      ],
    };
    const wrapper = mount(ListRecords, {
      props,
    });

    await wrapper.find("table tbody tr svg").trigger("click");

    expect(spy).toHaveBeenCalledWith("some-id", {
      limit: DEFAULT_RESULTS_LIMIT,
      skip: 0,
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should handle next pagination", async () => {
    const onRequestSpy = vi.spyOn(records, "getAction");
    props.records.result = {
      skip: 0,
      limit: 10,
      total: 11,
      result: [
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [50, 50],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.ADDITION,
        },
      ],
    };

    const wrapper = mount(ListRecords, {
      props,
    });

    expect(wrapper.find(".pagination-next").attributes().class).toMatch(
      /hover:text-blue-600/
    );

    expect(wrapper.find(".pagination-back").attributes().class).toMatch(
      /text-gray/
    );

    expect(onRequestSpy).not.toHaveBeenCalled();

    await wrapper.find(".pagination-next").trigger("click");

    expect(onRequestSpy).toHaveBeenCalledOnce();

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should handle back pagination", async () => {
    const onRequestSpy = vi.spyOn(records, "getAction");
    props.records.result = {
      skip: 10,
      limit: 10,
      total: 21,
      result: [
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [50, 50],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.ADDITION,
        },
      ],
    };

    const wrapper = mount(ListRecords, {
      props,
    });

    expect(wrapper.find(".pagination-next").attributes().class).toMatch(
      /hover:text-blue-600/
    );

    expect(wrapper.find(".pagination-back").attributes().class).toMatch(
      /hover:text-blue-600/
    );

    expect(onRequestSpy).not.toHaveBeenCalled();

    await wrapper.find(".pagination-back").trigger("click");

    expect(onRequestSpy).toHaveBeenCalledOnce();

    expect(wrapper.html()).toMatchSnapshot();
  });

  test("should handle orderBy and sortBy", async () => {
    const onRequestSpy = vi.spyOn(records, "getAction");
    props.records.result = {
      skip: 10,
      limit: 10,
      total: 21,
      result: [
        {
          cost: 20,
          date: new Date(1687827719926),
          id: "some-id",
          newUserBalance: 10,
          oldUserBalance: 30,
          operationArgs: [50, 50],
          operationId: "some-id",
          operationResult: 100,
          operationType: OperationType.ADDITION,
        },
      ],
    };

    const wrapper = mount(ListRecords, {
      props,
    });

    expect(onRequestSpy).not.toHaveBeenCalled();

    // should set operationType desc on first call

    const tableHeader = wrapper.findAll("table thead tr")[0];
    await tableHeader.findAll("th")[0].trigger("click");

    expect(onRequestSpy).toHaveBeenLastCalledWith({
      querystring: {
        limit: DEFAULT_RESULTS_LIMIT,
        skip: 0,
        orderBy: "operationType",
        sortBy: "desc",
      },
    });

    // should set operationType asc on second call

    await tableHeader.findAll("th")[0].trigger("click");

    expect(onRequestSpy).toHaveBeenLastCalledWith({
      querystring: {
        limit: DEFAULT_RESULTS_LIMIT,
        skip: 0,
        orderBy: "operationType",
        sortBy: "asc",
      },
    });

    // should reset orderBy on third call

    await tableHeader.findAll("th")[0].trigger("click");

    expect(onRequestSpy).toHaveBeenLastCalledWith({
      querystring: {
        limit: DEFAULT_RESULTS_LIMIT,
        skip: 0,
        orderBy: "",
        sortBy: "",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
