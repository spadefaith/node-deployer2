import {
  $,
  component$,
  QRL,
  useContext,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./table.scss?inline";
import { isServer } from "@builder.io/qwik/build";
import { icons, tableSettings } from "~/consts/table";
import { Tabulator } from "~/consts/lib";
import { initGlobal } from "~/utils";
import { TableContext } from "~/root";
const Table = component$(
  (props: {
    activeTab?: string;
    settings?: any;
    paginateHandler?: QRL<(e: any) => any>;
    rowActionHandler?: QRL<(e: any) => any>;
    rowMovedHandler?: QRL<(e: any) => any>;
    isReload?: any;
    columns: any[];
  }) => {
    useStyles$(styles);
    const tableRef = useSignal(null);
    const isFromSearch = useSignal(false);
    const isLoading = useSignal(false);
    const filterData = useSignal({});
    const tableContext = useContext(TableContext);

    const Actions = $((props: any) => {
      return /*html */ `
		<div class="flex">
			${props.options
        .map((item, key) => {
          if (item.type == "switch") {
            return /*html */ `
								<span class="px-2" key=${item.value}-key>
								<a class="cursor-pointer action-item has-text-link-dark" data-type=${item.value}>
								<div class="form-check form-switch">
									<input
									class="form-check-input"
									type="checkbox"
									data-role="switch"
									id=${item.ref}
									/>
									<label class="form-check-label">${item.label}</label>
								</div>
								</a>
							</span>
							`;
          }
          return /*html */ `<span class="mx-1" key=${item.value}-key>
							<a class="cursor-pointer action-item has-text-link-dark" data-type=${item.value}>
							${
                props.icons[item.value]
                  ? /*html */ `<img
								src=${props.icons[item.value] || null}
								style="width:15px"
								class=${item.label == "" ? "icon-only" : ""} ${
                  props.icons[item.value] || "".includes("icon-plus")
                    ? "custom-plus-icon"
                    : ""
                }/>`
                  : ""
              }
							<span >${item.label}</span>
							</a>
						</span>&nbsp;`;
        })
        .join("")}
		</div>
		`;
    });

    useVisibleTask$(async () => {
      if (isServer) {
        return;
      }

      const cols = await Promise.all(
        props.columns.map(async (item) => {
          if (item.field == "actions") {
            const options = item.options || [];
            item.width = item.width || options.length * 90 || 100;
            const actionsTemplate = await Actions({ options, icons: icons });
            const type = item.type;
            item = {
              ...item,
              ...{
                formatter: (cell, fr, onRendered) => {
                  onRendered(() => {
                    const celEl = cell.getElement();
                    const row = cell.getRow();
                    const data = row.getData();
                    const hasSwitch = options.some((item) => type == "switch");
                    if (hasSwitch) {
                      const switchs =
                        celEl.querySelectorAll("[data-role=switch]");
                      switchs.forEach((element) => {
                        const id = element.id;
                        const val = data[id];
                        if (!(val == false || val == true)) {
                          throw new Error("switch should have boolean value");
                        }
                        if (val) {
                          element.setAttribute("checked", true);
                        } else if (!val) {
                          element.removeAttribute("checked");
                        }
                      });
                    }
                    celEl.style.padding = "unset";
                  });
                  return actionsTemplate;
                },
                hozAlign: "center",
              },
            };
            // console.log(97, item);
            // item.height && (item.rowHeight = item.height);
            return item;
          }
          return item;
        })
      );

      // console.log(130, {
      //   ...(props.settings
      //     ? { ...tableSettings, ...props.settings }
      //     : tableSettings),
      // });

      const config = {
        ...(props.settings
          ? { ...tableSettings, ...props.settings }
          : tableSettings),
        // autoColumns: false,
        columns: cols,
        ajaxURL: "http://www.getmydata.com/now",
        ajaxResponse: (url, params, response) => {
          if (!response.status && response.message) {
            // showSimpleToast({ message: response.message });
          }
          if (response.status) {
            response.data.data = response.data.data.map((item) => {
              return Object.keys(item).reduce((accu, key) => {
                // if (key && ['created_date', 'modified_dt'].includes(key) && item[key]) {
                // 	item[key] = moment(item[key]).format('YYYY-MM-DD HH-mm-ss');
                // }
                accu[key] = item[key];
                return accu;
              }, {});
            });
            if (isFromSearch && !response.data.data.length) {
              // showSimpleToast({ message: 'no record found', displayMode: 2 });
            }
            return response.data;
          } else {
            if (isFromSearch && isFromSearch.value && !response.data.length) {
              // showSimpleToast({ message: 'no record found' });
            }
            return {
              last_page: 1,
              page: params.page,
              data: [],
            };
          }
        },
        ajaxRequestFunc: async function (url, config, params) {
          delete params.filter;
          if (!props.paginateHandler) {
            return { data: [] };
          }
          const datas = await props.paginateHandler({
            ...params,
            ...filterData.value,
          });

          if (!datas.status) {
            return { data: [] };
          }
          return datas;
        },
        rowFormatter: function (row) {
          // row.getElement().setAttribute('data-id', row.getData().id);
        },
        paginationCounter: function (
          pageSize,
          currentRow,
          currentPage,
          totalRows,
          totalPages
        ) {
          return `<div>Showing ${currentPage}-${totalPages} of ${totalRows}</div>`;
        },
        dataLoaderLoading: () => {
          return /*html */ `
					<div class="d-flex justify-content-center">
					<div class="spinner-border text-dark" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					</div>
				`;
        },
      };

      // console.log(159, config);
      const table = new Tabulator(tableRef.value, config);
      table.on("dataLoaded", (data) => {
        setTimeout(() => {
          isFromSearch.value = false;
          isLoading.value = false;
        }, 100);
        console.log("data is loaded");
      });
      table.on("rowSelectionChanged", (e) => console.log("selection changed"));
      table.on("rowClick", (e, _row) => {
        const target = e.target;
        const button = target.closest("A");
        const isSwitch =
          target.tagName == "INPUT" &&
          target.type == "checkbox" &&
          target.dataset.role == "switch";
        if (button && props.rowActionHandler) {
          const data = _row.getData();
          isSwitch && (data._switch = target.checked);
          props.rowActionHandler({
            action: button.dataset.type,
            data: data ? { ...data } : {},
          });
        }
      });
      table.on("rowMoved", function (row) {
        props.rowMovedHandler &&
          props.rowMovedHandler(row.getTable().getData());
      });

      initGlobal("tabula", table);
    });

    useVisibleTask$(({ track }) => {
      if (props.isReload) {
        track(() => props.isReload.value);
        props.isReload.value && initGlobal<any>("tabula").setData();
      }
    });

    return (
      <div class="table-container">
        <div>
          <div ref={tableRef}></div>
        </div>
      </div>
    );
  }
);

export default Table;
