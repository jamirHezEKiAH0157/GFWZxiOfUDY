// 代码生成时间: 2025-10-05 22:19:52
import { defineComponent, ref } from 'vue';

// 定义表格数据类型
interface TableData {
  name: string;
  age: number;
  location: string;
}

// Vue 组件
export default defineComponent({
  name: 'TableSortFilter',
  props: {
    items: Array as () => TableData[],
  },
  setup(props) {
    // 表格数据
    const data = ref<TableData[]>(props.items);
    
    // 排序的列名和排序类型（升序或降序）
    const sortDirection = ref<'asc' | 'desc' | null>(null);
    const sortedBy = ref<string | null>(null);
    
    // 排序函数
    function sortTable(column: keyof TableData): void {
      if (sortDirection.value === 'asc' && sortedBy.value === column) {
        sortDirection.value = 'desc';
      } else {
        sortDirection.value = 'asc';
      }
      sortedBy.value = column;

      data.value = [...data.value].sort((a, b) => {
        if (a[column] < b[column]) {
          return sortDirection.value === 'asc' ? -1 : 1;
        }
        if (a[column] > b[column]) {
          return sortDirection.value === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // 过滤函数
    function filterTable(query: string): void {
      if (query.trim() === '') {
        data.value = [...props.items];
      } else {
        data.value = props.items.filter(item => {
          return Object.values(item).some(value =>
            value.toString().toLowerCase().includes(query.toLowerCase())
          );
        });
      }
    }
    
    return {
      data,
      sortTable,
      filterTable,
      sortDirection,
      sortedBy,
    };
  }
});
</script>

<template>
  <div>
    <!-- 输入框用于过滤数据 -->
    <input type="text" @input="filterTable($event.target.value)" placeholder="Filter data..." />

    <table>
      <thead>
        <tr>
          <th @click="sortTable('name')" :class="{ sorted: sortedBy === 'name' }">Name</th>
          <th @click="sortTable('age')" :class="{ sorted: sortedBy === 'age' }">Age</th>
          <th @click="sortTable('location')" :class="{ sorted: sortedBy === 'location' }">Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.location }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* 你可以根据需要添加样式 */
.sorted {
  background-color: #f0f0f0;
}
</style>

<!-- 组件文档 -->
<!-- TableSortFilter.vue - A simple table component that supports sorting and filtering. -->