import React, { useEffect } from 'react';
import { AntdSelectComponent } from './Components';
import './index.css';
import { allowDrop, dropFormat } from '@lingting/code-generate/lib/core/PageGenerateDefault';

import PageGenerate from '@lingting/code-generate-react';
import { InputComponent, SelectComponent } from '@lingting/code-generate';

export default () => {
  useEffect(() => {}, []);

  return (
    <>
      <PageGenerate
        components={[InputComponent, SelectComponent, AntdSelectComponent]}
        leftRender={(componentMap) => {
          return (
            <div
              key="lingting-code-generate-key-left"
              className="lingting-code-generate-prefix-left"
            >
              <div
                key="lingting-code-generate-key-left-title"
                className="lingting-code-generate-prefix-left-title"
              >
                组件
              </div>

              <div
                key="lingting-code-generate-key-components"
                className="lingting-code-generate-prefix-left-components"
              >
                {Object.keys(componentMap).map((componentId) => {
                  const component = componentMap[componentId];
                  let icon;

                  if (component.icon) {
                    if (typeof component.icon === 'function') {
                      icon = component.icon();
                    } else {
                      icon = (
                        <i
                          key={`lingting-code-generate-key-component-icon-${componentId}`}
                          className={component.icon}
                        />
                      );
                    }
                  }

                  return (
                    <div
                      draggable={true}
                      className="lingting-code-generate-prefix-left-component"
                      key={`lingting-code-generate-key-component-${componentId}`}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(dropFormat, componentId);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      {icon}
                      <div
                        key={`lingting-code-generate-prefix-left-component-separation-${componentId}`}
                        className="lingting-code-generate-prefix-left-component-separation"
                      />
                      <div
                        className="lingting-code-generate-prefix-left-component-text"
                        title={component.name}
                      >
                        {component.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
        midRender={(componentMap, itemKeys, itemMap, insert, selectItem, itemRender) => {
          return (
            <div
              draggable={true}
              className="lingting-code-generate-prefix-mid"
              key="lingting-code-generate-key-mid"
              onDrop={(e) => {
                if (e && e.target && e.target instanceof HTMLElement) {
                  insert(componentMap[e.dataTransfer.getData(dropFormat)]);
                  e.preventDefault();
                }
              }}
              onDragEnter={(e) => {
                if (allowDrop(e)) {
                  e.preventDefault();
                }
              }}
              onDragOver={(e) => {
                if (allowDrop(e)) {
                  e.preventDefault();
                }
              }}
            >
              <div className="lingting-code-generate-prefix-mid-top">
                <div className="lingting-code-generate-prefix-mid-top-title">页面元素编辑</div>
                <div className="lingting-code-generate-prefix-mid-top-btn">
                  <button>删除</button>
                </div>
              </div>
              <div className="lingting-code-generate-prefix-mid-page">
                {itemKeys.map((key) => {
                  return itemRender(itemMap[key], () => {
                    selectItem(key);
                  });
                })}
              </div>
            </div>
          );
        }}
        itemRender={(item, select) => {
          return (
            <div
              id={`lingting-code-generate-mid-item-${item.key}`}
              className={`lingting-code-generate-prefix-mid-item-float lingting-code-generate-prefix-mid-item lingting-code-generate-prefix-mid-item-col lingting-code-generate-prefix-mid-item-col-${item.span}`}
              onClick={(e) => {
                const self = document.getElementById(`lingting-code-generate-mid-item-${item.key}`);

                if (!self || !self.parentElement) {
                  return;
                }

                const nodes =
                  self.parentElement.getElementsByClassName(
                    'lingting-code-generate-prefix-mid-item-select',
                  ) || [];
                for (let i = 0; i < nodes.length; i++) {
                  nodes[i].classList.remove('lingting-code-generate-prefix-mid-item-select');
                }
                self.classList.add('lingting-code-generate-prefix-mid-item-select');
                select();
                // 阻止继续冒泡
                e.preventDefault();
              }}
            >
              {item.component.render(item.options)}
            </div>
          );
        }}
      />
    </>
  );
};
