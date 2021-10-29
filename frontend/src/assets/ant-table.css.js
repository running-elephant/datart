/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function getCustomizeTableStyle() {
  return `
  .ant-table {
    font-size: 12px;
    color: #666;
    position: relative;
    overflow: hidden;
    background-color: transparent !important;
  }
  .ant-table-body {
    -webkit-transition: opacity 0.3s ease;
    transition: opacity 0.3s ease;
  }
  .ant-table table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    border-radius: 6px 6px 0 0;
    overflow: hidden;
  }
  .ant-table-thead > tr > th {
    background: #f7f7f7;
    font-weight: bold;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
    text-align: left;
  }
  .ant-table-thead > tr > th .anticon-filter {
    margin-left: 4px;
    display: inline-block;
    font-size: 12px;
    font-size: 10px \\9;
    -webkit-transform: scale(0.83333333) rotate(0deg);
    transform: scale(0.83333333) rotate(0deg);
    /* IE6-IE8 */
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    cursor: pointer;
    color: #aaa;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  :root .ant-table-thead > tr > th .anticon-filter {
    -webkit-filter: none;
    filter: none;
  }
  :root .ant-table-thead > tr > th .anticon-filter {
    font-size: 12px;
  }
  .ant-table-thead > tr > th .anticon-filter:hover {
    color: #666;
  }
  .ant-table-thead > tr > th .ant-table-filter-selected.anticon-filter {
    color: #2db7f5;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #e9e9e9;
  }
  .ant-table-thead > tr,
  .ant-table-tbody > tr {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  .ant-table-thead > tr.ant-table-row-hover,
  .ant-table-tbody > tr.ant-table-row-hover,
  .ant-table-thead > tr:hover,
  .ant-table-tbody > tr:hover {
    background: #eaf8fe;
  }
  .ant-table-thead > tr:hover {
    background: none;
  }
  .ant-table-footer {
    padding: 16px 8px;
    background: #f7f7f7;
    position: relative;
    z-index: 2;
    top: -1px;
    border-radius: 0 0 6px 6px;
  }
  .ant-table.ant-table-bordered .ant-table-footer {
    border: 1px solid #e9e9e9;
  }
  .ant-table-title {
    padding: 16px 8px;
    position: relative;
    top: 1px;
    border-radius: 6px 6px 0 0;
  }
  .ant-table.ant-table-bordered .ant-table-title {
    border: 1px solid #e9e9e9;
  }
  .ant-table-title + .ant-table-content {
    position: relative;
  }
  .ant-table-title + .ant-table-content table {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .ant-table-tbody > tr.ant-table-row-selected {
    background: #fafafa;
  }
  .ant-table-thead > tr > th.ant-table-column-sort {
    background: #eaeaea;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 8px;
    word-break: break-all;
  }
  .ant-table-thead > tr > th.ant-table-selection-column,
  .ant-table-tbody > tr > td.ant-table-selection-column {
    text-align: center;
    width: 60px;
  }
  .ant-table-header {
    background: #f7f7f7;
    overflow: hidden;
    border-radius: 6px 6px 0 0;
  }
  .ant-table-header table {
    border-radius: 6px 6px 0 0;
  }
  .ant-table-loading {
    position: relative;
  }
  .ant-table-loading .ant-table-body {
    background: #fff;
    opacity: 0.5;
  }
  .ant-table-loading .ant-table-spin-holder {
    height: 20px;
    line-height: 20px;
    left: 50%;
    top: 50%;
    margin-left: -30px;
    position: absolute;
  }
  .ant-table-loading .ant-table-with-pagination {
    margin-top: -20px;
  }
  .ant-table-loading .ant-table-without-pagination {
    margin-top: 10px;
  }
  .ant-table-middle .ant-table-thead > tr > th,
  .ant-table-middle .ant-table-tbody > tr > td {
    padding: 10px 8px;
  }
  .ant-table-small {
    border: 1px solid #e9e9e9;
    border-radius: 6px;
  }
  .ant-table-small .ant-table-body > table {
    border: 0;
    padding: 0 0px;
  }
  .ant-table-small.ant-table-bordered .ant-table-body > table {
    border: 0;
  }
  .ant-table-small .ant-table-thead > tr > th {
    padding: 10px 8px;
    background: #fff;
    border-bottom: 1px solid #e9e9e9;
  }
  .ant-table-small .ant-table-tbody > tr > td {
    padding: 6px 8px;
  }
  .ant-table-small .ant-table-header {
    background: #fff;
  }
  .ant-table-small .ant-table-header table {
    border-bottom: 1px solid #e9e9e9;
  }
  .ant-table-small .ant-table-header .ant-table-thead > tr > th {
    border-bottom: 0;
  }
  .ant-table-small .ant-table-row:last-child td {
    border-bottom: 0;
  }
  .ant-table-column-sorter {
    margin-left: 4px;
    display: inline-block;
    width: 12px;
    height: 15px;
    vertical-align: middle;
    text-align: center;
  }
  .ant-table-column-sorter-up,
  .ant-table-column-sorter-down {
    line-height: 4px;
    height: 6px;
    display: block;
    width: 12px;
    cursor: pointer;
  }
  .ant-table-column-sorter-up:hover .anticon,
  .ant-table-column-sorter-down:hover .anticon {
    color: #666;
  }
  .ant-table-column-sorter-up.on .anticon-caret-up,
  .ant-table-column-sorter-down.on .anticon-caret-up,
  .ant-table-column-sorter-up.on .anticon-caret-down,
  .ant-table-column-sorter-down.on .anticon-caret-down {
    color: #2db7f5;
  }
  .ant-table-column-sorter .anticon-caret-up,
  .ant-table-column-sorter .anticon-caret-down {
    display: inline-block;
    font-size: 12px;
    font-size: 6px \\9;
    -webkit-transform: scale(0.5) rotate(0deg);
    transform: scale(0.5) rotate(0deg);
    /* IE6-IE8 */
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    line-height: 6px;
    height: 6px;
    color: #aaa;
  }
  :root .ant-table-column-sorter .anticon-caret-up,
  :root .ant-table-column-sorter .anticon-caret-down {
    -webkit-filter: none;
    filter: none;
  }
  :root .ant-table-column-sorter .anticon-caret-up,
  :root .ant-table-column-sorter .anticon-caret-down {
    font-size: 12px;
  }
  .ant-table-column-sorter .anticon-caret-up:before,
  .ant-table-column-sorter .anticon-caret-down:before {
    -moz-transform-origin: 53% 50%;
    /* fix firefox position */
  }
  .ant-table-bordered .ant-table-body > table {
    border: 1px solid #e9e9e9;
  }
  .ant-table-bordered.ant-table-fixed-header {
    border: 1px solid #e9e9e9;
  }
  .ant-table-bordered.ant-table-fixed-header table {
    border: 0;
  }
  .ant-table-bordered.ant-table-fixed-header .ant-table-fixed-left {
    border-right: 1px solid #e9e9e9;
  }
  .ant-table-bordered.ant-table-fixed-header .ant-table-fixed-right {
    border-left: 1px solid #e9e9e9;
  }
  .ant-table-bordered.ant-table-fixed-header .ant-table-placeholder {
    border-bottom: 0;
  }
  .ant-table-bordered .ant-table-thead > tr > th {
    border-bottom: 1px solid #e9e9e9;
  }
  .ant-table-bordered.ant-table-empty .ant-table-thead > tr:last-child > th {
    border-bottom: 0;
  }
  .ant-table-bordered .ant-table-tbody tr:last-child > th,
  .ant-table-bordered .ant-table-tbody tr:last-child > td {
    border-bottom: 0;
  }
  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid #e9e9e9;
  }
  .ant-table-bordered .ant-table-thead > tr:first-child > th:last-child,
  .ant-table-bordered .ant-table-tbody > tr > td:last-child {
    border-right: 0;
  }
  .ant-table-placeholder {
    padding: 16px 8px;
    background: #fff;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
    position: relative;
    z-index: 2;
    font-size: 12px;
    color: #999;
  }
  .ant-table-placeholder .anticon {
    margin-right: 4px;
  }
  .ant-table-pagination {
    margin: 16px 0;
    float: right;
  }
  .ant-table-filter-dropdown {
    min-width: 96px;
    margin-left: -8px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    box-shadow: 0 1px 6px rgba(100, 100, 100, 0.2);
  }
  .ant-table-filter-dropdown .ant-dropdown-menu {
    border: 0;
    box-shadow: none;
    border-radius: 6px 6px 0 0;
  }
  .ant-table-filter-dropdown .ant-dropdown-menu-item > label + span {
    margin-left: 8px;
  }
  .ant-table-filter-dropdown .ant-dropdown-menu-sub {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    box-shadow: 0 1px 6px rgba(100, 100, 100, 0.2);
  }
  .ant-table-filter-dropdown
    .ant-dropdown-menu
    .ant-dropdown-submenu-contain-selected
    .ant-dropdown-menu-submenu-title:after {
    color: #2db7f5;
    font-weight: bold;
    text-shadow: 0 0 2px #d5f1fd;
  }
  .ant-table-filter-dropdown .ant-dropdown-menu-item {
    overflow: hidden;
  }
  .ant-table-filter-dropdown
    > .ant-dropdown-menu
    > .ant-dropdown-menu-item:last-child,
  .ant-table-filter-dropdown
    > .ant-dropdown-menu
    > .ant-dropdown-menu-submenu:last-child
    .ant-dropdown-menu-submenu-title {
    border-radius: 0;
  }
  .ant-table-filter-dropdown-btns {
    overflow: hidden;
    padding: 7px 15px;
    border-top: 1px solid #e9e9e9;
  }
  .ant-table-filter-dropdown-link {
    color: #2db7f5;
  }
  .ant-table-filter-dropdown-link:hover {
    color: #57c5f7;
  }
  .ant-table-filter-dropdown-link:active {
    color: #2baee9;
  }
  .ant-table-filter-dropdown-link.confirm {
    float: left;
  }
  .ant-table-filter-dropdown-link.clear {
    float: right;
  }
  .ant-table-expand-icon-th {
    width: 34px;
  }
  .ant-table-row-expand-icon {
    cursor: pointer;
    display: inline-block;
    width: 17px;
    height: 17px;
    text-align: center;
    line-height: 14px;
    border: 1px solid #e9e9e9;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background: #fff;
  }
  .ant-table-row-expand-icon-cell {
    width: 18px;
  }
  .ant-table-row-expanded:after {
    content: '-';
  }
  .ant-table-row-collapsed:after {
    content: '+';
  }
  .ant-table-row-spaced {
    visibility: hidden;
  }
  .ant-table-row-spaced:after {
    content: '.';
  }
  .ant-table-row[class*='ant-table-row-level-0']
    .ant-table-selection-column
    > span {
    display: inline-block;
  }
  tr.ant-table-expanded-row,
  tr.ant-table-expanded-row:hover {
    background: #fbfbfb;
  }
  .ant-table .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 8px;
  }
  .ant-table-scroll {
    overflow: auto;
  }
  .ant-table-scroll table {
    width: auto;
    min-width: 100%;
  }
  .ant-table-body-inner {
    height: 100%;
  }
  .ant-table-fixed-header .ant-table-body {
    position: relative;
    background: #fff;
  }
  .ant-table-fixed-header .ant-table-body-inner {
    overflow: scroll;
  }
  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: scroll;
    padding-bottom: 20px;
    margin-bottom: -20px;
  }
  .ant-table-fixed-left,
  .ant-table-fixed-right {
    position: absolute;
    top: 0;
    overflow: hidden;
    z-index: 1;
    -webkit-transition: box-shadow 0.3s ease;
    transition: box-shadow 0.3s ease;
    border-radius: 0;
  }
  .ant-table-fixed-left table,
  .ant-table-fixed-right table {
    width: auto;
    background: #fff;
  }
  .ant-table-fixed-header
    .ant-table-fixed-left
    .ant-table-body-outer
    .ant-table-fixed,
  .ant-table-fixed-header
    .ant-table-fixed-right
    .ant-table-body-outer
    .ant-table-fixed {
    border-radius: 0;
  }
  .ant-table-fixed-left {
    left: 0;
    box-shadow: 1px 0 6px rgba(100, 100, 100, 0.2);
  }
  .ant-table-fixed-left .ant-table-header {
    overflow-y: hidden;
  }
  .ant-table-fixed-left .ant-table-body-inner {
    margin-right: -20px;
    padding-right: 20px;
  }
  .ant-table-fixed-header .ant-table-fixed-left .ant-table-body-inner {
    padding-right: 0;
  }
  .ant-table-fixed-left,
  .ant-table-fixed-left table {
    border-radius: 6px 0 0 0;
  }
  .ant-table-fixed-right {
    right: 0;
    box-shadow: -1px 0 6px rgba(100, 100, 100, 0.2);
  }
  .ant-table-fixed-right,
  .ant-table-fixed-right table {
    border-radius: 0 6px 0 0;
  }
  .ant-table-fixed-right .ant-table-expanded-row {
    color: transparent;
    pointer-events: none;
  }
  .ant-table.ant-table-scroll-position-left .ant-table-fixed-left {
    box-shadow: none;
  }
  .ant-table.ant-table-scroll-position-right .ant-table-fixed-right {
    box-shadow: none;
  }
  .ant-table-column-hidden {
    display: none;
  }
  .ant-table-thead > tr > th.ant-table-column-has-prev {
    position: relative;
  }
  .ant-table-thead > tr > th.ant-table-column-has-prev,
  .ant-table-tbody > tr > td.ant-table-column-has-prev {
    padding-left: 24px;
  }
  .ant-table-prev-columns-page,
  .ant-table-next-columns-page {
    cursor: pointer;
    color: #666;
    z-index: 1;
  }
  .ant-table-prev-columns-page:hover,
  .ant-table-next-columns-page:hover {
    color: #2db7f5;
  }
  .ant-table-prev-columns-page-disabled,
  .ant-table-next-columns-page-disabled {
    cursor: not-allowed;
    color: #bbb;
  }
  .ant-table-prev-columns-page-disabled:hover,
  .ant-table-next-columns-page-disabled:hover {
    color: #bbb;
  }
  .ant-table-prev-columns-page {
    position: absolute;
    left: 8px;
  }
  .ant-table-prev-columns-page:before {
    content: '\\e601';
    display: inline-block;
    font-size: 12px;
    font-size: 9px \\9;
    -webkit-transform: scale(0.75) rotate(0deg);
    transform: scale(0.75) rotate(0deg);
    /* IE6-IE8 */
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    font-weight: bold;
    font-family: anticon;
  }
  :root .ant-table-prev-columns-page:before {
    -webkit-filter: none;
    filter: none;
  }
  :root .ant-table-prev-columns-page:before {
    font-size: 12px;
  }
  .ant-table-next-columns-page {
    float: right;
    margin-left: 8px;
  }
  .ant-table-next-columns-page:before {
    content: '\\e600';
    display: inline-block;
    font-size: 12px;
    font-size: 9px \\9;
    -webkit-transform: scale(0.75) rotate(0deg);
    transform: scale(0.75) rotate(0deg);
    /* IE6-IE8 */
    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    font-weight: bold;
    font-family: anticon;
  }
  /* stylelint-disable at-rule-empty-line-before,at-rule-name-space-after,at-rule-no-unknown */
  /* stylelint-disable no-duplicate-selectors */
  /* stylelint-disable */
  /* stylelint-disable declaration-bang-space-before,no-duplicate-selectors,string-no-newline */
  .ant-pagination {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
  }
  .ant-pagination ul,
  .ant-pagination ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ant-pagination::after {
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    content: ' ';
  }
  .ant-pagination-total-text {
    display: inline-block;
    height: 32px;
    margin-right: 8px;
    line-height: 30px;
    vertical-align: middle;
  }
  .ant-pagination-item {
    display: inline-block;
    min-width: 32px;
    height: 32px;
    margin-right: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    list-style: none;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    outline: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: rgba(0, 0, 0, 0.85);
    transition: none;
  }
  .ant-pagination-item a:hover {
    text-decoration: none;
  }
  .ant-pagination-item:focus-visible,
  .ant-pagination-item:hover {
    border-color: #1890ff;
    transition: all 0.3s;
  }
  .ant-pagination-item:focus-visible a,
  .ant-pagination-item:hover a {
    color: #1890ff;
  }
  .ant-pagination-item-active {
    font-weight: 500;
    background: #fff;
    border-color: #1890ff;
  }
  .ant-pagination-item-active a {
    color: #1890ff;
  }
  .ant-pagination-item-active:focus-visible,
  .ant-pagination-item-active:hover {
    border-color: #40a9ff;
  }
  .ant-pagination-item-active:focus-visible a,
  .ant-pagination-item-active:hover a {
    color: #40a9ff;
  }
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    outline: 0;
  }
  .ant-pagination-jump-prev .ant-pagination-item-container,
  .ant-pagination-jump-next .ant-pagination-item-container {
    position: relative;
  }
  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-link-icon,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-link-icon {
    color: #1890ff;
    font-size: 12px;
    letter-spacing: -1px;
    opacity: 0;
    transition: all 0.2s;
  }
  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-link-icon-svg,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-link-icon-svg {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    margin: auto;
    color: rgba(0, 0, 0, 0.25);
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 2px;
    text-align: center;
    text-indent: 0.13em;
    opacity: 1;
    transition: all 0.2s;
  }
  .ant-pagination-jump-prev:focus-visible .ant-pagination-item-link-icon,
  .ant-pagination-jump-next:focus-visible .ant-pagination-item-link-icon,
  .ant-pagination-jump-prev:hover .ant-pagination-item-link-icon,
  .ant-pagination-jump-next:hover .ant-pagination-item-link-icon {
    opacity: 1;
  }
  .ant-pagination-jump-prev:focus-visible .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next:focus-visible .ant-pagination-item-ellipsis,
  .ant-pagination-jump-prev:hover .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next:hover .ant-pagination-item-ellipsis {
    opacity: 0;
  }
  .ant-pagination-prev,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    margin-right: 8px;
  }
  .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    display: inline-block;
    min-width: 32px;
    height: 32px;
    color: rgba(0, 0, 0, 0.85);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    list-style: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    font-family: Arial, Helvetica, sans-serif;
    outline: 0;
  }
  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .ant-pagination-prev:hover button,
  .ant-pagination-next:hover button {
    border-color: #40a9ff;
  }
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    outline: none;
    transition: all 0.3s;
  }
  .ant-pagination-prev:focus-visible .ant-pagination-item-link,
  .ant-pagination-next:focus-visible .ant-pagination-item-link,
  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: #1890ff;
    border-color: #1890ff;
  }
  .ant-pagination-disabled,
  .ant-pagination-disabled:hover,
  .ant-pagination-disabled:focus-visible {
    cursor: not-allowed;
  }
  .ant-pagination-disabled .ant-pagination-item-link,
  .ant-pagination-disabled:hover .ant-pagination-item-link,
  .ant-pagination-disabled:focus-visible .ant-pagination-item-link {
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-pagination-slash {
    margin: 0 10px 0 5px;
  }
  .ant-pagination-options {
    display: inline-block;
    margin-left: 16px;
    vertical-align: middle;
  }
  @media all and (-ms-high-contrast: none) {
    .ant-pagination-options *::-ms-backdrop,
    .ant-pagination-options {
      vertical-align: top;
    }
  }
  .ant-pagination-options-size-changer.ant-select {
    display: inline-block;
    width: auto;
  }
  .ant-pagination-options-quick-jumper {
    display: inline-block;
    height: 32px;
    margin-left: 8px;
    line-height: 32px;
    vertical-align: top;
  }
  .ant-pagination-options-quick-jumper input {
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s;
    width: 50px;
    height: 32px;
    margin: 0 8px;
  }
  .ant-pagination-options-quick-jumper input::-moz-placeholder {
    opacity: 1;
  }
  .ant-pagination-options-quick-jumper input:-ms-input-placeholder {
    color: #bfbfbf;
  }
  .ant-pagination-options-quick-jumper input::placeholder {
    color: #bfbfbf;
  }
  .ant-pagination-options-quick-jumper input:-moz-placeholder-shown {
    text-overflow: ellipsis;
  }
  .ant-pagination-options-quick-jumper input:-ms-input-placeholder {
    text-overflow: ellipsis;
  }
  .ant-pagination-options-quick-jumper input:placeholder-shown {
    text-overflow: ellipsis;
  }
  .ant-pagination-options-quick-jumper input:hover {
    border-color: #40a9ff;
    border-right-width: 1px !important;
  }
  .ant-pagination-options-quick-jumper input:focus,
  .ant-pagination-options-quick-jumper input-focused {
    border-color: #40a9ff;
    border-right-width: 1px !important;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  .ant-pagination-options-quick-jumper input-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-pagination-options-quick-jumper input-disabled:hover {
    border-color: #d9d9d9;
    border-right-width: 1px !important;
  }
  .ant-pagination-options-quick-jumper input[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-pagination-options-quick-jumper input[disabled]:hover {
    border-color: #d9d9d9;
    border-right-width: 1px !important;
  }
  .ant-pagination-options-quick-jumper input-borderless,
  .ant-pagination-options-quick-jumper input-borderless:hover,
  .ant-pagination-options-quick-jumper input-borderless:focus,
  .ant-pagination-options-quick-jumper input-borderless-focused,
  .ant-pagination-options-quick-jumper input-borderless-disabled,
  .ant-pagination-options-quick-jumper input-borderless[disabled] {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  textarea.ant-pagination-options-quick-jumper input {
    max-width: 100%;
    height: auto;
    min-height: 32px;
    line-height: 1.5715;
    vertical-align: bottom;
    transition: all 0.3s, height 0s;
  }
  .ant-pagination-options-quick-jumper input-lg {
    padding: 6.5px 11px;
    font-size: 16px;
  }
  .ant-pagination-options-quick-jumper input-sm {
    padding: 0px 7px;
  }
  .ant-pagination-simple .ant-pagination-prev,
  .ant-pagination-simple .ant-pagination-next {
    height: 24px;
    line-height: 24px;
    vertical-align: top;
  }
  .ant-pagination-simple .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-simple .ant-pagination-next .ant-pagination-item-link {
    height: 24px;
    background-color: transparent;
    border: 0;
  }
  .ant-pagination-simple .ant-pagination-prev .ant-pagination-item-link::after,
  .ant-pagination-simple .ant-pagination-next .ant-pagination-item-link::after {
    height: 24px;
    line-height: 24px;
  }
  .ant-pagination-simple .ant-pagination-simple-pager {
    display: inline-block;
    height: 24px;
    margin-right: 8px;
  }
  .ant-pagination-simple .ant-pagination-simple-pager input {
    box-sizing: border-box;
    height: 100%;
    margin-right: 8px;
    padding: 0 6px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.3s;
  }
  .ant-pagination-simple .ant-pagination-simple-pager input:hover {
    border-color: #1890ff;
  }
  .ant-pagination-simple .ant-pagination-simple-pager input[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-pagination.mini .ant-pagination-total-text,
  .ant-pagination.mini .ant-pagination-simple-pager {
    height: 24px;
    line-height: 24px;
  }
  .ant-pagination.mini .ant-pagination-item {
    min-width: 24px;
    height: 24px;
    margin: 0;
    line-height: 22px;
  }
  .ant-pagination.mini .ant-pagination-item:not(.ant-pagination-item-active) {
    background: transparent;
    border-color: transparent;
  }
  .ant-pagination.mini .ant-pagination-prev,
  .ant-pagination.mini .ant-pagination-next {
    min-width: 24px;
    height: 24px;
    margin: 0;
    line-height: 24px;
  }
  .ant-pagination.mini .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination.mini .ant-pagination-next .ant-pagination-item-link {
    background: transparent;
    border-color: transparent;
  }
  .ant-pagination.mini .ant-pagination-prev .ant-pagination-item-link::after,
  .ant-pagination.mini .ant-pagination-next .ant-pagination-item-link::after {
    height: 24px;
    line-height: 24px;
  }
  .ant-pagination.mini .ant-pagination-jump-prev,
  .ant-pagination.mini .ant-pagination-jump-next {
    height: 24px;
    margin-right: 0;
    line-height: 24px;
  }
  .ant-pagination.mini .ant-pagination-options {
    margin-left: 2px;
  }
  .ant-pagination.mini .ant-pagination-options-size-changer {
    top: 0px;
  }
  .ant-pagination.mini .ant-pagination-options-quick-jumper {
    height: 24px;
    line-height: 24px;
  }
  .ant-pagination.mini .ant-pagination-options-quick-jumper input {
    padding: 0px 7px;
    width: 44px;
    height: 24px;
  }
  .ant-pagination.ant-pagination-disabled {
    cursor: not-allowed;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item {
    background: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item a {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
    border: none;
    cursor: not-allowed;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item-active {
    background: #e6e6e6;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item-active a {
    color: rgba(0, 0, 0, 0.25);
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item-link {
    color: rgba(0, 0, 0, 0.25);
    background: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-pagination-simple.ant-pagination.ant-pagination-disabled
    .ant-pagination-item-link {
    background: transparent;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item-link-icon {
    opacity: 0;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-item-ellipsis {
    opacity: 1;
  }
  .ant-pagination.ant-pagination-disabled .ant-pagination-simple-pager {
    color: rgba(0, 0, 0, 0.25);
  }
  @media only screen and (max-width: 992px) {
    .ant-pagination-item-after-jump-prev,
    .ant-pagination-item-before-jump-next {
      display: none;
    }
  }
  @media only screen and (max-width: 576px) {
    .ant-pagination-options {
      display: none;
    }
  }
  .ant-pagination-rtl .ant-pagination-total-text {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-pagination-rtl .ant-pagination-item,
  .ant-pagination-rtl .ant-pagination-prev,
  .ant-pagination-rtl .ant-pagination-jump-prev,
  .ant-pagination-rtl .ant-pagination-jump-next {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-pagination-rtl .ant-pagination-slash {
    margin: 0 5px 0 10px;
  }
  .ant-pagination-rtl .ant-pagination-options {
    margin-right: 16px;
    margin-left: 0;
  }
  .ant-pagination-rtl
    .ant-pagination-options
    .ant-pagination-options-size-changer.ant-select {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-pagination-rtl
    .ant-pagination-options
    .ant-pagination-options-quick-jumper {
    margin-left: 0;
  }
  .ant-pagination-rtl.ant-pagination-simple .ant-pagination-simple-pager {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-pagination-rtl.ant-pagination-simple .ant-pagination-simple-pager input {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-pagination-rtl.ant-pagination.mini .ant-pagination-options {
    margin-right: 2px;
    margin-left: 0;
  }

  :root .ant-table-next-columns-page:before {
    -webkit-filter: none;
    filter: none;
  }
  :root .ant-table-next-columns-page:before {
    font-size: 12px;
  }
  `;
}
