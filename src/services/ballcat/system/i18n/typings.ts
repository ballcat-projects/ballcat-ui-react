export type SysI18nListVo = {
  id: number;
  code: string;
  languageTag: string;
  message: string;
  remarks: string;
  updateTime: string;
  createTime: string;
};

export type SysI18nDto = {
  id: number;
  code: string;
  languageTag: string;
  message: string;
  remarks: string;
  updateTime: string;
  createTime: string;
  // 语言文本
  languageTexts?: {
    // 语言标签
    languageTag: string;

    // 文本值，可以使用 { } 加角标，作为占位符
    message: string;
  };
};

export type SysI18nQo = {
  code: string;
  message: string;
  languageTag: string;
};

export type SysI18nVo = {
  // ID
  id: number;
  // 语言标签
  languageTag: string;
  // 国际化标识
  code: string;
  // 文本值，可以使用 { } 加角标，作为占位符
  message: string;
  // 备注
  remarks: string;
  // 创建时间
  createTime: string;
  // 修改时间
  updateTime: string;
};

export type SysI18nLanguage = {
  //  国际化标识
  code: string;
  // 消息
  message: string;
  // 地区语言标签
  languageTag: string;
};
