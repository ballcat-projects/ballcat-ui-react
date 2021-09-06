/**
 * 纯数组转树形结构
 * @param data 源数据
 * @param rootVal 顶级的 pField 字段值
 * @param itemHandler 用来处理数据, 有些使用情况需要对部分字段进行转换
 * @param kField 唯一值字段, 子级的 pFeild 字段值为父级的 kField 字段值
 * @param pField 用来寻找父级的字段
 * @param cField 用来存放子级数据的字段
 */
export function ofList<T>(
  data: T[],
  rootVal: any,
  itemHandler = (item: T) => item,
  kField = 'id',
  pField = 'parentId',
  cField = 'children',
) {
  const treeData: T[] = [];

  let index = 0;

  while (index < data.length) {
    const item = itemHandler(data[index]);

    // 当前数据为子级
    if (item[pField] === rootVal) {
      // 删除当前数据
      data.splice(index, 1);
      // 查找自己的子级
      const children = ofList(data, item[kField], itemHandler, kField, pField, cField);
      // 如果没有子级,则赋值 undefined, 避免 ProTable 渲染左边的 + 号
      item[cField] = children.length > 0 ? children : undefined;
      // 插入节点数据
      treeData.push(item);
      // 在查询的过程中, 有可能删除前面的数据
      index = 0;
    } else {
      // 不是子级, 查找下一个
      index += 1;
    }
  }

  return treeData;
}
