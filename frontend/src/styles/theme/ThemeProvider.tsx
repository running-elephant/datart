import { darkThemeSingle } from 'antd/dist/theme';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as OriginalThemeProvider } from 'styled-components';
import { useThemeSlice } from './slice';
import { selectTheme, selectThemeKey } from './slice/selectors';

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  useThemeSlice();

  const theme = useSelector(selectTheme);
  const themeKey = useSelector(selectThemeKey);

  useEffect(() => {
    if (themeKey === 'dark') {
      (window as any).less
        .modifyVars(darkThemeSingle)
        .then((res: any) => {
          console.log('切换主题成功');
        })
        .catch((res: any) => {
          console.log('切换主题错误');
        });
    }
  }, [themeKey]);

  return (
    <OriginalThemeProvider theme={theme}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
