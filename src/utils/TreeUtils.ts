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

/**
 * 树形结构 - TreeSelect
 * @param data 数据
 * @param itemHandler 用来处理数据, 有些使用情况需要对部分字段进行转换
 * @param kField value 属性名
 * @param lField label 属性名
 * @param cField children 属性名
 */
export function toTreeSelectData<T>(
  data: T[],
  itemHandler = (item: T) => item,
  kField = 'id',
  lField = 'name',
  cField = 'children',
) {
  const treeData: T[] = [];

  data.forEach((item) => {
    const node = {
      label: item[lField],
      value: item[kField],
      ...itemHandler(item),
    };

    if (item[cField] && item[cField] instanceof Array) {
      node[cField] = toTreeSelectData(item[cField], itemHandler, kField, lField, cField);
    } else {
      node[cField] = undefined;
    }

    treeData.push(node);
  });

  return treeData.length > 0 ? treeData : undefined;
}

/**
 * 树形结构 - Tree
 * @param data 数据
 * @param itemHandler 用来处理数据, 有些使用情况需要对部分字段进行转换
 * @param kField key 属性名
 * @param tField title 属性名
 * @param cField children 属性名
 * @returns
 */
export function toTreeData<T>(
  data: T[],
  itemHandler = (item: T) => item,
  kField = 'id',
  tField = 'name',
  cField = 'children',
) {
  const treeData: T[] = [];

  data.forEach((item) => {
    const node = {
      title: item[tField],
      key: item[kField],
      ...itemHandler(item),
    };

    if (item[cField] && item[cField] instanceof Array) {
      node[cField] = toTreeData(item[cField], itemHandler, kField, tField, cField);
    } else {
      node[cField] = undefined;
    }

    treeData.push(node);
  });

  return treeData.length > 0 ? treeData : undefined;
}

/**
 * 树形结构过滤
 * @param data 树形结构数据
 * @param filter 过滤函数, 判断当前数据是否展示
 * @param showParent 判断在当前数据不展示的情况下, 有子级要展示时是否展示自己
 * @param cField 子级字段名称
 */
export function treeFilter<T>(
  data: T[],
  filter: (item: T) => boolean = () => true,
  showParent: (item: T, children: T[]) => boolean = () => true,
  cField = 'children',
) {
  const filterData: T[] = [];

  data.forEach((item) => {
    // 自己是否展示
    const showSelf = filter(item);
    // 获取需要展示的子级
    let children: any[] | undefined = treeFilter(item[cField] || [], filter, showParent, cField);
    children = children && children.length > 0 ? children : undefined;
    const fd = { ...item };
    // 如果展示自己
    if (showSelf) {
      fd[cField] = children;
      filterData.push(fd);
    }
    // 有子级要展示
    else if (children && children.length > 0) {
      // @ts-ignore 展示父级
      if (showParent(item, children)) {
        fd[cField] = children;
        filterData.push(fd);
      }
      // 不展示父级, 把子级提权到父级
      else {
        // @ts-ignore
        filterData.push(...children);
      }
    }
  });
  return filterData;
}

export default { ofList, toTreeSelectData, toTreeData, treeFilter };
