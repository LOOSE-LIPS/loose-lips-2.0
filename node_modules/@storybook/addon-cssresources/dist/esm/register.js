import * as React from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { CssResourcePanel } from './css-resource-panel';
addons.register(ADDON_ID, function (api) {
  // Need to cast as any as it's not matching Addon type, to investigate
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'CSS resources',
    render: function render(_ref) {
      var active = _ref.active;
      return /*#__PURE__*/React.createElement(CssResourcePanel, {
        key: PANEL_ID,
        api: api,
        active: active
      });
    },
    paramKey: PARAM_KEY
  });
});