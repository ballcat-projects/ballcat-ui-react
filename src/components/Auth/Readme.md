### Demo

```typescript jsx
<Auth permission={'system:dict:read'} type={'a'} text={'权限测试'} />

<Auth permission={'system:dict:read'} type={'a'} text={'权限测试'} prefix={true} onClick={() => {
  alert('单击');
}} />

<Auth permission={'system:dict:read'} type={'button'} localeKey={'auth.test'} prefix={true} />

<Auth permission={'system:dict:read'} type={<span>自定义</span>} localeKey={'auth.test'} prefix={true} />

<Auth permission={'system:dict:read'} type={(text) => <span>自定义-{text}</span>} localeKey={'auth.test'}
      prefix={true} />

<Auth.A permission={'system:dict:read'} localeKey={'auth.test'} prefix={true} />

<Auth.Button permission={'system:dict:read'} localeKey={'auth.test'} prefix={true} />

<Auth.AL
  auths={[
    { permission: 'system:dict:edit', text: 'a1' , onClick: ()=>{alert("123")}},
    { permission: 'system:dict:read', text: 'a2' },
    { permission: 'system:dict:read', text: 'a2' },
    { permission: 'system:dict:read', text: 'a2' },
  ]}
/>


<Auth.BL
  auths={[
    { permission: 'system:dict:edit', text: 'a1' , onClick: ()=>{alert("123")}},
    { permission: 'system:dict:read', text: 'a2' },
    { permission: 'system:dict:read', text: 'a2' },
    { permission: 'system:dict:read', text: 'a2' },
  ]}
/>
```
