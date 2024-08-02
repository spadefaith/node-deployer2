export default [
  {
    tag: "row",
    children: [
      {
        display: "Role",
        name: "role_id",
        placeholder: "role",
        tag: "select",
        options: [],
        label: true,
        relation: {
          path: "roles/options?type=form",
          attributes: [
            ["role_id", "value"],
            ["desc", "display"],
          ],
          defaultValue: "Select user role",
        },
      },
      {
        display: "Email",
        name: "email",
        placeholder: "email",
        tag: "input",
        type: "text",
        label: true,
      },
      {
        display: "Username",
        name: "username",
        placeholder: "username",
        tag: "input",
        type: "text",
        label: true,
      },
      {
        display: "Name",
        name: "name",
        placeholder: "name",
        tag: "input",
        type: "text",
        label: true,
      },
    ],
  },
  {
    tag: "row",
    children: [
      {
        display: "Priority",
        name: "priority",
        placeholder: "priority",
        tag: "select",
        options: [
          { display: "Select priority" },
          { display: "High", value: "HIGH" },
          { display: "Medium", value: "MEDIUM" },
          { display: "Low", value: "LOW" },
        ],
        label: true,
      },
      {
        display: "Location",
        name: "location_id",
        placeholder: "location",
        tag: "select",
        options: [],
        label: true,
        relation: {
          path: "users1/options?type=form&module=location",
          attributes: [
            ["location_id", "value"],
            ["name", "display"],
          ],
          defaultValue: "Select user location",
        },
        validator: "required=true",
      },
    ],
  },
];
