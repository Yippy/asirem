import { extend, override } from 'flarum/common/extend';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import TagsPage from 'flarum/tags/components/TagsPage';
import AsiremTagsPage from './components/TagsPage';
import { truncate } from 'flarum/utils/string';
import textContrastClass from 'flarum/common/helpers/textContrastClass';
import classList from 'flarum/common/utils/classList';
import Link from 'flarum/common/components/Link';
import highlight from 'flarum/common/helpers/highlight';
import listItems from 'flarum/common/helpers/listItems';

import Footer from 'flarum/extensions/afrux-theme-base/forum/components/Footer';

const designOptions = {
  "StickyNote": {
    isPrimaryTagBackgroundColorRequired: false,
    isPrimaryTagAnButton: false,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: true,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: false,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteTag": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: true,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: true,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: false,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteFilingTag": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: true,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: true,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: false,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteBanner": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: false,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: true,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: false,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteMinimal": {
    isPrimaryTagBackgroundColorRequired: false,
    isPrimaryTagAnButton: false,
    primaryBackgroundColor: 'transparent',
    isChildTagBackgroundColorRequired: false,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: true,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteMinimalTag": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: true,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: false,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: true,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteMinimalFilingTag": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: true,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: false,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: true,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  },
  "StickyNoteMinimalBanner": {
    isPrimaryTagBackgroundColorRequired: true,
    isPrimaryTagAnButton: false,
    primaryBackgroundColor: '#e8ecf3',
    isChildTagBackgroundColorRequired: false,
    childBackgroundColor: '#e8ecf3',
    isOutlineTagBackgroundColorRequired: true,
    outlineBackgroundColor: '#595a58',
    unreadColor: '#2199fc',
  }
};

app.initializers.add('afrux-asirem', () => {
  extend(DiscussionListItem.prototype, 'view', function (vnode) {
    const discussionListItemContent = vnode.children.find(
      (e) => e && e.tag === 'div' && e.attrs && e.attrs.className.includes('DiscussionListItem-content')
    );
    let discussionDesign = app.forum.attribute('afrux-asirem.designDefault');
    let discussionDesignOption = designOptions[discussionDesign];

    discussionListItemContent.children[0] = (
      <div className='DiscussionListItem-author-container'>{[discussionListItemContent.children[0], discussionListItemContent.children[1]]}</div>
    );

    delete discussionListItemContent.children[1];

    discussionListItemContent.children[3] = <div className='DiscussionListItem-stats'>{discussionListItemContent.children[3]}</div>;

    let childTagFound = null;
    let parentTagFound = null;
    if (this.attrs.discussion.tags() && this.attrs.discussion.tags().length > 0) {
      // Collect all secondary tags that has position set as 'null'
      let secondaryTags = {
        tag: "span",
        attrs: {
          class: 'DiscussionListItem--secondary',
          style: {
          },
        },
        children: []
      };
      for (const tag of this.attrs.discussion.tags()) {
        if (tag.data.attributes.isChild) {
          childTagFound = tag;
        } else if (tag.data.attributes.position == null) {
          secondaryTags.children.push(
            <span class="TagLabel" style={'--tag-bg:' + tag.color()}>
              <span class={classList("TagLabel-text", textContrastClass(tag.color()))}>
                <i class={'TagLabel-icon ' + tag.data.attributes.icon }></i>
                <span class="TagLabel-name">{tag.data.attributes.name}</span>
              </span>
            </span>
          );
        } else {
          parentTagFound = tag;
        }
      };

      if (parentTagFound) {
        if (childTagFound == null) {
          childTagFound = parentTagFound;
        }
        let footerColor = discussionDesignOption.isPrimaryTagBackgroundColorRequired ? parentTagFound.color(): discussionDesignOption.primaryBackgroundColor;
        if (discussionDesignOption.isPrimaryTagAnButton) {
          discussionListItemContent.children.push(
            <span class={( discussionDesign == 'StickyNoteMinimalFilingTag' || discussionDesign == 'StickyNoteFilingTag' ? 'DiscussionListItem--filingfooter': 'DiscussionListItem-footer')}>
              <span class="PrimaryTagLabel" style={'background:' + parentTagFound.color()}>
                <span class={classList("PrimaryTagLabel-text", textContrastClass(parentTagFound.color()))}>
                  <i class={'PrimaryTagLabel-icon ' + parentTagFound.data.attributes.icon + " fa-1x"}></i>
                  <span class="PrimaryTagLabel-name">{parentTagFound.data.attributes.name}</span>
                </span>
              </span>{secondaryTags}
            </span>
          );
        } else {
          discussionListItemContent.children.push(
            <span class={classList('DiscussionListItem-footer', textContrastClass(footerColor))} style={'background:' + footerColor }>
              <span class='DiscussionListItem--primary'>
                <i aria-hidden="true" class={'TagLabel-icon ' + parentTagFound.data.attributes.icon + " fa-1x"}></i>{parentTagFound.data.attributes.name}
              </span>{secondaryTags}
            </span>
          );
        }
      }
    }
    let backgroundColor = discussionDesignOption.outlineBackgroundColor;
    if (childTagFound) {
      backgroundColor = childTagFound.color();
    }
    switch(discussionDesign) {
      case 'StickyNoteFilingTag':
        if(childTagFound) {
          discussionListItemContent.children.push(
            <span class='DiscussionListItem--outline' style={'box-shadow:' +('inset -15px -15px 0px 0px '+backgroundColor)}>
            </span>
          );
        }
        break;
      case 'StickyNoteMinimal':
      case 'StickyNoteMinimalTag':
      case 'StickyNoteMinimalBanner':
        discussionListItemContent.children.push(
          <span class='DiscussionListItem--outline' style={'box-shadow:' +('inset -6px -6px 0px 0px '+backgroundColor+'; height: 100%; bottom: 0;')}>
          </span>
        );
        break;
      case 'StickyNoteMinimalFilingTag':
        if(childTagFound) {
          discussionListItemContent.children.push(
            <span class='DiscussionListItem--outline' style={'box-shadow:' +('inset -6px -6px 0px 0px '+backgroundColor+';height: calc(100% - 25px); bottom: 18px;')}>
            </span>
          );
          break;
        } else {
          discussionListItemContent.children.push(
            <span class='DiscussionListItem--outline' style={'box-shadow:' +('inset -6px -6px 0px 0px '+backgroundColor+'; height: 100%; bottom: 0;')}>
            </span>
          );
        }

    }
    if (childTagFound) {
      vnode.attrs.style = {'background': (discussionDesignOption.isChildTagBackgroundColorRequired? childTagFound.color(): discussionDesignOption.childBackgroundColor), ...(vnode.attrs.style || {}) };

      discussionListItemContent.children.push(<span class=' DiscussionListItem--read' style={'border-color:' + (discussionDesignOption.isOutlineTagBackgroundColorRequired ? childTagFound.color() : discussionDesignOption.outlineBackgroundColor)}></span>);
    } else {
      vnode.attrs.style = {'background': discussionDesignOption.childBackgroundColor, ...(vnode.attrs.style || {}) };

      discussionListItemContent.children.push(<span class=' DiscussionListItem--read' style={'border-color:' + discussionDesignOption.outlineBackgroundColor}></span>);
    }
    if (this.attrs.discussion.isUnread()) {
      discussionListItemContent.children.push(<span class=' DiscussionListItem--unread' style={'border-color:' +discussionDesignOption.unreadColor}></span>);
    }
    vnode.attrs.className += ' ' + discussionDesign;
  });

  override(DiscussionListItem.prototype, 'mainView', function () {
    const discussion = this.attrs.discussion;
    const jumpTo = this.getJumpTo();

    let discussionDesign = app.forum.attribute('afrux-asirem.designDefault');
    let discussionDesignOption = designOptions[discussionDesign];

    let textContrastColor = textContrastClass(discussionDesignOption.childBackgroundColor);
    // Override text color depending if isChildTagBackgroundColorRequired
    if (discussionDesignOption.isChildTagBackgroundColorRequired) {
      if (this.attrs.discussion.tags() && this.attrs.discussion.tags().length > 0) {
        let childTagFound = null;
        let parentTagFound = null;
        for (const tag of this.attrs.discussion.tags()) {
          if (tag.data.attributes.isChild) {
            childTagFound = tag;
          } else if (tag.data.attributes.position >= 0) {
            parentTagFound = tag;
          }
        }
        if (childTagFound) {
          textContrastColor = textContrastClass(childTagFound.color());
        } else if (parentTagFound) {
          textContrastColor = textContrastClass(parentTagFound.color());
        }
      }
    }
    return (
      <Link href={app.route.discussion(discussion, jumpTo)} className='DiscussionListItem-main'>
        <h2 className={classList("DiscussionListItem-title-edit", textContrastColor)}>{highlight(discussion.title(), this.highlightRegExp)}</h2>
        <ul className={classList("DiscussionListItem-info-edit", textContrastColor)}>{listItems(this.infoItems().toArray())}</ul>
      </Link>
    );
  });

  extend(DiscussionListItem.prototype, 'infoItems', function (items) {
    let childTag = null;
    if (this.attrs.discussion.tags() && this.attrs.discussion.tags().length > 1) {
      for (const tag of this.attrs.discussion.tags()) {
        if (tag.data.attributes.isChild) {
          childTag = tag;
          break;
        }
      }
    }

    if (!items.has('excerpt')) {
      const firstPost = this.attrs.discussion.firstPost();

      if (firstPost) {
        const excerpt = truncate(firstPost.contentPlain(), 175);

        items.add('excerpt', <div>{excerpt}</div>, -100);
      }
    }

    // Display tag
    if (items.has('tags')) {
      items.remove('tags');
    }

    if (childTag) {
      items.add('tag', 
        <span class='TagLabel-inner'><center><i aria-hidden="true" class={'TagLabel-icon ' + childTag.data.attributes.icon + " fa-1x"}></i>{childTag.data.attributes.name}</center></span>, -100);
    } else {
      items.add('tag', <span class='TagLabel-inner'></span>, -100);
    }
  });

  override(Footer.prototype, 'separator', function () {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="288" className="Asirem-footerWaves">
        <path
          fill-opacity="1"
          d="M0,224L18.5,186.7C36.9,149,74,75,111,58.7C147.7,43,185,85,222,112C258.5,139,295,149,332,154.7C369.2,160,406,160,443,149.3C480,139,517,117,554,101.3C590.8,85,628,75,665,96C701.5,117,738,171,775,165.3C812.3,160,849,96,886,101.3C923.1,107,960,181,997,218.7C1033.8,256,1071,256,1108,250.7C1144.6,245,1182,235,1218,202.7C1255.4,171,1292,117,1329,117.3C1366.2,117,1403,171,1422,197.3L1440,224L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
        ></path>
      </svg>
    );
  });

  override(TagsPage.prototype, 'view', AsiremTagsPage.prototype.view);
});
