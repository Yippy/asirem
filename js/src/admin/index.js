import { extend, override } from 'flarum/extend';
import PermissionsPage from 'flarum/admin/components/PermissionsPage';
import PermissionGrid from 'flarum/admin/components/PermissionGrid';

app.initializers.add(
  'afrux-asirem',
  (app) => {
    extend(PermissionsPage.prototype, 'content', function (vnode) {
      if (vnode && vnode[0] && vnode[0].children && vnode[0].children[1]) {
        vnode[0].children[1].attrs.className += ' Button--dashed';
      }
    });

    override(PermissionGrid.prototype, 'view', function (original, vnode) {
      return [<div className="PermissionsPage-permissions-overflow">{original(vnode)}</div>];
    });

    extend(PermissionGrid.prototype, ['oncreate', 'onupdate'], function (vnode) {
      $('.PermissionGrid-child .Button--text').removeClass('Button--text');
    });
    app.extensionData
      .registerSetting({
          setting: 'afrux-asirem.design-default',
          type: 'select',
          options: {
              'StickyNote': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note'),
              'StickyNoteTag': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_tag'),
              'StickyNoteFilingTag': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_filing_tag'),
              'StickyNoteBanner': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_banner'),
              'StickyNoteMinimal': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_minimal'),
              'StickyNoteMinimalTag': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_minimal_tag'),
              'StickyNoteMinimalFilingTag': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_minimal_filing_tag'),
              'StickyNoteMinimalBanner': app.translator.trans('afrux-asirem.admin.options.design_options.sticky_note_minimal_banner'),
          },
          default: 'StickyNote',
          label: app.translator.trans('afrux-asirem.admin.labels.design_default'),
          help: app.translator.trans('afrux-asirem.admin.helps.design_default'),
      });
  },
  -999999
);
