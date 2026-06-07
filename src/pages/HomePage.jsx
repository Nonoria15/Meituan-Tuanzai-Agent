import {
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Link2,
  Copy,
  MessageCircle,
  QrCode,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import BottomNav from '../components/BottomNav.jsx';
import { friends } from '../data/mockData.js';

const logoPath = '/images/meituan-logo.png';

const grid = [
  { label: '外卖', icon: '/images/icon_waimai.png' },
  { label: '到店美食', icon: '/images/icon_food.png' },
  { label: '休闲玩乐', icon: '/images/icon_play.png' },
  { label: '电影演出', icon: '/images/icon_movie.png' },
  { label: '酒店预订', icon: '/images/icon_hotel.png' },
  { label: '旅游门票', icon: '/images/icon_ticket.png' },
  { label: '超市闪购', icon: '/images/icon_mart.png' },
  { label: '生活服务', icon: '/images/icon_service.png' },
];

const recommendations = [
  {
    name: '光影沉浸式艺术展',
    rating: '4.9',
    distance: '1.2km',
    price: '周末套餐 ¥98 起',
    image: 'url("https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=480&q=80")',
  },
  {
    name: '晴川日料·炙烧专门店',
    rating: '4.8',
    distance: '1.6km',
    price: '双人套餐 ¥168 起',
    image: 'url("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=480&q=80")',
  },
  {
    name: '城市桌游咖啡局',
    rating: '4.7',
    distance: '2.0km',
    price: '畅玩券 ¥58 起',
    image: 'url("https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=480&q=80")',
  },
];

function friendSummary(selectedFriends) {
  if (!selectedFriends?.length) return '未选择';
  const names = selectedFriends.map((friend) => friend.name);
  if (names.length <= 2) return names.join('、');
  return `${names.slice(0, 2).join('、')} +${names.length - 2}`;
}

const relationTypes = ['家人', '孩子', '老人', '朋友', '同事', '其他'];
const preferenceTags = [
  '少走路',
  '安静',
  '亲子友好',
  '不要太晚',
  '预算敏感',
  '喜欢拍照',
  '喜欢日料',
  '喜欢火锅',
  '室内优先',
  '可接受排队',
  '不喜欢排队',
];
const invitedFriend = {
  id: 'invite-xiaochen',
  name: '小陈',
  avatar: '陈',
  source: 'invite',
  authorized: true,
  tags: ['火锅', '预算内', '少排队', '同商圈'],
  summary: '通过邀请加入，偏好火锅、预算内和少排队。',
};

function friendSource(friend) {
  return friend.source || 'meituan';
}

function friendBadge(friend, selected) {
  if (friendSource(friend) === 'manual') return '本次创建';
  if (friendSource(friend) === 'invite') return '已接受邀请';
  return selected ? '已授权' : '本次授权';
}

function friendOptions(draftFriends) {
  const customFriends = draftFriends.filter((friend) => friendSource(friend) !== 'meituan');
  return [...friends.map((friend) => ({ ...friend, source: 'meituan' })), ...customFriends].filter(
    (friend, index, list) => list.findIndex((item) => item.id === friend.id) === index,
  );
}

export default function HomePage({ onStart, selectedFriends = [], onFriendsChange }) {
  const [friendSheetOpen, setFriendSheetOpen] = useState(false);
  const [friendSheetMode, setFriendSheetMode] = useState('list');
  const [draftFriends, setDraftFriends] = useState(selectedFriends);
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState('家人');
  const [manualTags, setManualTags] = useState(['少走路', '安静']);
  const [manualNote, setManualNote] = useState('');
  const [friendToast, setFriendToast] = useState('');

  const openFriendSheet = () => {
    setDraftFriends(selectedFriends);
    setFriendSheetMode('list');
    setFriendSheetOpen(true);
  };

  const closeFriendSheet = () => {
    setDraftFriends(selectedFriends);
    setFriendSheetMode('list');
    setFriendSheetOpen(false);
  };

  const toggleDraftFriend = (friend) => {
    setDraftFriends((current) =>
      current.some((item) => item.id === friend.id)
        ? current.filter((item) => item.id !== friend.id)
        : [...current, friend],
    );
  };

  const confirmFriends = () => {
    onFriendsChange?.(draftFriends);
    setFriendSheetOpen(false);
    setFriendSheetMode('list');
  };

  const showFriendToast = (message) => {
    setFriendToast(message);
    window.setTimeout(() => setFriendToast(''), 1500);
  };

  const toggleManualTag = (tag) => {
    setManualTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const saveManualFriend = () => {
    const name = manualName.trim() || manualType;
    const newFriend = {
      id: `manual-${Date.now()}`,
      name,
      avatar: name.slice(0, 1),
      source: 'manual',
      authorized: true,
      relation: manualType,
      tags: manualTags.length ? manualTags : ['少走路'],
      summary: manualNote.trim() || `${manualType}同行人，偏好${(manualTags.length ? manualTags : ['少走路']).slice(0, 4).join('、')}。`,
    };
    setDraftFriends((current) => [...current.filter((friend) => friend.id !== newFriend.id), newFriend]);
    setManualName('');
    setManualType('家人');
    setManualTags(['少走路', '安静']);
    setManualNote('');
    setFriendSheetMode('list');
    showFriendToast('已添加并选中同行人');
  };

  const acceptInvite = () => {
    setDraftFriends((current) =>
      current.some((friend) => friend.id === invitedFriend.id) ? current : [...current, invitedFriend],
    );
    showFriendToast('小陈已接受邀请并加入本次规划');
    setFriendSheetMode('list');
  };

  return (
    <>
      <main className="mobile-home-page min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
        <section className="mobile-home-hero">
          <div className="mobile-home-topbar">
            <button className="mobile-home-city">
              <MapPin size={16} /> 北京
            </button>
            <img src={logoPath} alt="美团" className="h-8 w-auto object-contain" />
          </div>
          <div className="mobile-home-search">
            <Search size={18} className="text-[#666]" />
            <span>搜索商家、活动、周末安排</span>
          </div>
        </section>

        <section className="mobile-feature-card">
          <div className="mobile-feature-grid">
            {grid.map(({ label, icon }) => (
              <button
                key={label}
                className="mobile-feature-item"
              >
                <span className="mobile-feature-icon">
                  <img src={icon} alt="" className="mobile-feature-icon-img" />
                </span>
                <span className="mobile-feature-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mobile-ai-section">
          <div
            role="button"
            tabIndex={0}
            onClick={onStart}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onStart();
            }}
            className="mobile-ai-card"
          >
            <div className="mobile-ai-badge">
              <Sparkles size={13} />
              基于美团小团
            </div>
            <h1>团崽 AI · 周末帮我排</h1>
            <p>基于美团小团升级，帮你规划多人吃喝玩乐路线。</p>
            <div className="mobile-ai-pills">
              <span>多人偏好协调</span>
              <span>实时排队预约</span>
              <span>路线预算规划</span>
              <span>异常兜底</span>
            </div>
            <div className="mobile-ai-input">
              <img src="/images/icon_keyword.png" alt="" className="mobile-ai-inline-icon" />
              <span>下午带娃出去，4-6小时...</span>
            </div>
            <button
              className="mobile-friend-row"
              onClick={(event) => {
                event.stopPropagation();
                openFriendSheet();
              }}
            >
              <span>
                <img src="/images/icon_multi.png" alt="" className="mobile-ai-inline-icon" />
                同行人：{friendSummary(selectedFriends)}
              </span>
              <strong>{selectedFriends.length ? '已授权' : '+ 选择美团好友'}</strong>
            </button>
            <button
              className="mobile-ai-button"
              onClick={(event) => {
                event.stopPropagation();
                onStart();
              }}
            >
              生成方案
            </button>
          </div>
        </section>

        <section className="mobile-nearby-section">
          <div className="mobile-section-heading">
            <div>
              <h2>附近值得去</h2>
              <p>按距离和评分推荐</p>
            </div>
          </div>
          <div className="mobile-nearby-list">
            {recommendations.map((item) => (
              <div key={item.name} className="mobile-nearby-item">
                <div className="mobile-nearby-image" style={{ background: item.image }} />
                <div className="mobile-nearby-copy">
                  <h3>{item.name}</h3>
                  <div className="mobile-nearby-meta">
                    <span className="mobile-rating">{item.rating} 分</span>
                    <span className="mobile-dot">·</span>
                    <span>{item.distance}</span>
                    <span className="mobile-dot">·</span>
                    <span>今日可订</span>
                  </div>
                  <p>{item.price}</p>
                </div>
                <ChevronRight size={20} className="mobile-nearby-arrow" />
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="首页" />
      {friendSheetOpen && (
        <div
          className="mobile-friend-sheet-backdrop"
          onClick={() => setFriendSheetOpen(false)}
        >
          <div
            className="mobile-friend-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            {friendSheetMode === 'list' && (
              <>
                <div className="mobile-friend-header">
                  <div className="mobile-friend-sheet-handle" />
                  <h3>选择同行好友</h3>
                  <p>偏好授权仅用于本次行程规划，不展示具体订单记录。</p>
                  <div className="mobile-friend-summary">
                    <strong>{draftFriends.length ? `已选 ${draftFriends.length} 位同行人` : '未选择同行人'}</strong>
                    <span>
                      {draftFriends.length
                        ? '将用于平衡电影 / 餐厅 / 路线偏好'
                        : '未选择同行人，将仅按你的偏好规划'}
                    </span>
                  </div>
                </div>
                <div className="mobile-friend-list">
                  <div className="mobile-add-companion">
                    <button onClick={() => setFriendSheetMode('manual')}>
                      <span className="mobile-add-icon">
                        <UserPlus size={18} />
                      </span>
                      <strong>手动创建同行人</strong>
                      <small>适合老人、小孩或临时同行人</small>
                    </button>
                    <button onClick={() => setFriendSheetMode('invite')}>
                      <span className="mobile-add-icon">
                        <Link2 size={18} />
                      </span>
                      <strong>分享链接邀请</strong>
                      <small>好友接受后自动加入本次规划</small>
                    </button>
                  </div>
                  {friendOptions(draftFriends).map((friend) => {
                    const selected = draftFriends.some((item) => item.id === friend.id);
                    return (
                      <button
                        key={friend.id}
                        className={`mobile-friend-card ${selected ? 'is-selected' : ''}`}
                        onClick={() => toggleDraftFriend(friend)}
                      >
                        <span className="mobile-friend-avatar">{friend.avatar}</span>
                        <span className="mobile-friend-main">
                          <span className="mobile-friend-title-row">
                            <strong>{friend.name}</strong>
                            <em>{friendBadge(friend, selected)}</em>
                          </span>
                          <small>{friend.summary}</small>
                          <span className="mobile-friend-tags">
                            {friend.tags.slice(0, 4).map((tag) => (
                              <em key={tag}>{tag}</em>
                            ))}
                          </span>
                        </span>
                        <span className="mobile-friend-auth">
                          {selected ? (
                            <>
                              <CheckCircle2 size={13} />
                              已选择
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={13} />
                              可加入
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mobile-friend-actions">
                  <button onClick={closeFriendSheet}>取消</button>
                  <button onClick={confirmFriends}>确认同行人</button>
                </div>
              </>
            )}
            {friendSheetMode === 'manual' && (
              <>
                <div className="mobile-friend-header">
                  <div className="mobile-friend-sheet-handle" />
                  <button className="mobile-sheet-back" onClick={() => setFriendSheetMode('list')}>
                    <ArrowLeft size={16} />
                    返回
                  </button>
                  <h3>手动创建同行人</h3>
                  <p>适合老人、小孩或没有美团账号的临时同行人，仅用于本次规划。</p>
                </div>
                <div className="mobile-friend-list">
                  <label className="mobile-manual-field">
                    <span>昵称</span>
                    <input
                      value={manualName}
                      onChange={(event) => setManualName(event.target.value)}
                      placeholder="妈妈、爸爸、宝宝、同事A"
                    />
                  </label>
                  <label className="mobile-manual-field">
                    <span>关系 / 类型</span>
                    <select value={manualType} onChange={(event) => setManualType(event.target.value)}>
                      {relationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <div className="mobile-manual-field">
                    <span>偏好标签</span>
                    <div className="mobile-manual-tags">
                      {preferenceTags.map((tag) => (
                        <button
                          key={tag}
                          className={manualTags.includes(tag) ? 'is-selected' : ''}
                          onClick={() => toggleManualTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="mobile-manual-field">
                    <span>备注（可选）</span>
                    <textarea
                      value={manualNote}
                      onChange={(event) => setManualNote(event.target.value)}
                      placeholder="例如：腿脚不方便、不能吃辣、晚上不能太晚"
                    />
                  </label>
                </div>
                <div className="mobile-friend-actions">
                  <button onClick={() => setFriendSheetMode('list')}>返回</button>
                  <button onClick={saveManualFriend}>保存同行人</button>
                </div>
              </>
            )}
            {friendSheetMode === 'invite' && (
              <>
                <div className="mobile-friend-header">
                  <div className="mobile-friend-sheet-handle" />
                  <button className="mobile-sheet-back" onClick={() => setFriendSheetMode('list')}>
                    <ArrowLeft size={16} />
                    返回
                  </button>
                  <h3>邀请同行人加入本次规划</h3>
                  <p>对方接受后，团崽 AI 将仅使用其本次授权偏好参与行程规划，不展示具体订单记录。</p>
                </div>
                <div className="mobile-friend-list">
                  <div className="mobile-invite-link">
                    <span>邀请链接</span>
                    <strong>meituan.com/weekend-plan/invite/8K27</strong>
                  </div>
                  <div className="mobile-share-grid">
                    <button onClick={() => showFriendToast('已模拟发送邀请')}>
                      <MessageCircle size={18} />
                      微信
                    </button>
                    <button onClick={() => showFriendToast('已模拟发送邀请')}>
                      <MessageCircle size={18} />
                      QQ
                    </button>
                    <button onClick={() => showFriendToast('邀请链接已复制')}>
                      <Copy size={18} />
                      复制链接
                    </button>
                    <button onClick={() => showFriendToast('已生成面对面邀请码')}>
                      <QrCode size={18} />
                      面对面扫码
                    </button>
                  </div>
                  <div className="mobile-invite-preview">
                    <strong>模拟邀请状态</strong>
                    <p>好友接受后会自动加入同行人，并授权本次偏好用于规划。</p>
                    <button onClick={acceptInvite}>模拟好友接受</button>
                  </div>
                </div>
                <div className="mobile-friend-actions">
                  <button onClick={() => setFriendSheetMode('list')}>返回</button>
                  <button onClick={confirmFriends}>确认同行人</button>
                </div>
              </>
            )}
            {friendToast && <div className="mobile-friend-toast">{friendToast}</div>}
          </div>
        </div>
      )}
    </>
  );
}
