<template>
  <el-table
    :border="true"
    class-name="list"
    :data="issues"
    :stripe="true"
    size="medium"
    >
    <el-table-column
      prop="id"
      label="Id"
      sortable
      :min-width="15" >
      <template slot-scope="scope">
        <a :href="`/issues/${scope.row.id}`">{{ scope.row.id }}</a>
      </template>
    </el-table-column>
    <el-table-column
      prop="subject"
      label="Subject"
      sortable
      :min-width="40" >
      <template slot-scope="scope">
        <a :href="`/issues/${scope.row.id}`">{{ scope.row.subject }}</a>
      </template>
    </el-table-column>
    <el-table-column
      prop="status.name"
      label="Status"
      :filters="statusFilter()"
      sortable
      :min-width="15" >
    </el-table-column>
    <el-table-column
      prop="assigned_to.name"
      label="Assignee"
      sortable
      :min-width="15" >
    </el-table-column>
    <el-table-column
      prop="due_date"
      label="Due date"
      :filters="dueDateFilter()"
      sortable
      :min-width="15" >
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Table, TableColumn } from 'element-ui';
Vue.use(Table)
Vue.use(TableColumn)

import _ from 'underscore/underscore-min.js';

@Component
export default class SubtaskTable extends Vue {
  issues: Array<any>

  statusFilter(): Array<{text: string, value: string|number}> {
    const statuses = this.issues.map(issue => ({
      value: issue.status.id,
      text: issue.status.name
    }))

    return _.uniq(statuses, 'value')
  }

  dueDateFilter(): Array<{text: string, value: string}> {
    const statuses = this.issues.map(issue => ({
      value: issue.due_date,
      text: issue.due_date
    }))

    return _.uniq(statuses, 'value')
  }
}
</script>