const REGS = {
  password: /^[0-9a-zA-Z][0-9a-zA-Z_]{5,19}$/,
};
export const RULES = {
  password: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      validator(_, value) {
        if (value && !REGS.password.test(value)) {
          return Promise.reject(new Error('由6-20位字母、数字、下划线组成'));
        }
        return Promise.resolve();
      },
    },
  ],
  getConfirmRule: (filed = 'newPassword') => {
    return [
      { required: true, message: '密码不能为空' },
      ({ getFieldValue }) => {
        return {
          validator(_, value) {
            if (value && !REGS.password.test(value)) {
              return Promise.reject(
                new Error('由6-20位字母、数字、下划线组成'),
              );
            }
            if (value && getFieldValue(filed) !== value) {
              return Promise.reject(new Error('两次输入的密码不一致'));
            }
            return Promise.resolve();
          },
        };
      },
    ];
  },
};
