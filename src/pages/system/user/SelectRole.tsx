import { useState, useEffect } from 'react';
import { Select } from 'antd';
import type { SysRole } from '@/services/ballcat/system';
import { role } from '@/services/ballcat/system';
import type { SelectData } from '@/typings';

type SelectRoleProps = {
  value?: string[];
  onChange?: (val: string[]) => void;
};

export default ({ value, onChange }: SelectRoleProps) => {
  const [roles, setRoles] = useState<SelectData<SysRole>[]>([]);

  useEffect(() => {
    role.listSelectData().then(({ data }) => {
      setRoles(data);
    });
  }, []);

  return (
    <Select
      allowClear
      placeholder="请选择角色!"
      mode="tags"
      value={value}
      onChange={onChange}
      loading={roles.length === 0}
    >
      {roles.map((item) => {
        return (
          <Select.Option key={item.value} value={item.value}>
            {item.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};
