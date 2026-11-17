"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { LinkItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { IconPicker } from "@/components/ui/IconPicker";
import {
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  MousePointerClick,
  FolderOpen,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";

// Common Lucide icon presets for links
const POPULAR_ICONS = [
  "Globe",
  "Youtube",
  "Tiktok",
  "Twitter",
  "Instagram",
  "MessageSquare",
  "Music",
  "BookOpen",
  "ShoppingBag",
  "Briefcase",
  "Mail",
  "Zap",
  "Code",
  "Podcast",
  "FileText",
  "Award",
];

const PRESET_CATEGORIES = [
  "All",
  "Youtube",
  "TikTok",
  "Instagram",
  "Twitter",
  "Saweria",
  "Community",
  "Music",
  "Newsletter",
  "Shop",
  "Work",
];

function LinkThumbnail({
  thumbnailUrl,
  icon,
}: {
  thumbnailUrl?: string;
  icon?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (thumbnailUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt=""
        onError={() => setHasError(true)}
        className="w-full h-full rounded-xl object-cover"
      />
    );
  }

  return <IconRenderer name={icon || "Globe"} className="w-5 h-5" />;
}

interface DraggableLinkItemProps {
  link: LinkItem;
  index: number;
  total: number;
  isLight: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleHighlight: (id: string) => void;
  onOpenEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function DraggableLinkItem({
  link,
  index,
  total,
  isLight,
  onMoveUp,
  onMoveDown,
  onToggleHighlight,
  onOpenEdit,
  onDelete,
  onToggleStatus,
}: DraggableLinkItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={link}
      dragListener={false}
      dragControls={dragControls}
      layout
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
      }}
      whileDrag={{
        scale: 1.025,
        boxShadow: isLight
          ? "0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 0 15px rgba(16, 185, 129, 0.25)"
          : "0 25px 35px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.35)",
        zIndex: 50,
        borderColor: "#10b981",
      }}
      className={cn(
        "relative p-4 rounded-2xl border select-none shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
        isLight
          ? "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md"
          : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
      )}
    >
      {/* Drag Handle & Info */}
      <div className="flex items-start sm:items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
        {/* Drag Controls Column (Handle + Quick Up/Down buttons) */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 select-none">
          {/* Quick Up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(index);
            }}
            disabled={index === 0}
            className={cn(
              "p-0.5 rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed",
              isLight
                ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-600 hover:text-slate-200 hover:bg-slate-800"
            )}
            title="Pindah ke Atas"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Grip Vertical Drag Handle */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className={cn(
              "p-1.5 rounded-lg cursor-grab active:cursor-grabbing touch-none transition-colors",
              isLight
                ? "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/80"
            )}
            title="Tahan & geser untuk memindahkan posisi"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Quick Down */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(index);
            }}
            disabled={index === total - 1}
            className={cn(
              "p-0.5 rounded transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed",
              isLight
                ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-600 hover:text-slate-200 hover:bg-slate-800"
            )}
            title="Pindah ke Bawah"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Icon or Thumbnail */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 text-emerald-400 overflow-hidden transition-colors",
            isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
          )}
        >
          <LinkThumbnail
            thumbnailUrl={link.thumbnail_url}
            icon={link.icon}
          />
        </div>

        {/* Link Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-semibold text-sm truncate transition-colors",
                isLight ? "text-slate-900" : "text-slate-100"
              )}
            >
              {link.title}
            </span>
            {link.is_highlighted && (
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3" />
                Glow
              </span>
            )}
            {link.category && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-mono hidden sm:inline shrink-0 transition-colors",
                  isLight
                    ? "bg-slate-100 border border-slate-200 text-slate-600"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {link.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span
              className={cn(
                "truncate max-w-[200px] sm:max-w-xs font-mono transition-colors",
                isLight ? "text-slate-600" : "text-slate-500"
              )}
            >
              {link.url}
            </span>
            <span className="flex items-center gap-1 text-slate-400 shrink-0">
              <MousePointerClick className="w-3 h-3 text-cyan-400" />
              <strong
                className={cn(
                  "transition-colors",
                  isLight ? "text-slate-800" : "text-slate-200"
                )}
              >
                {formatNumber(link.click_count)}
              </strong>{" "}
              clicks
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons & Toggles */}
      <div
        className={cn(
          "flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 shrink-0 transition-colors",
          isLight ? "border-slate-100" : "border-slate-800/60"
        )}
      >
        {/* Highlight Glow Toggle */}
        <button
          onClick={() => onToggleHighlight(link.id)}
          title={link.is_highlighted ? "Remove Glow" : "Add Glow"}
          className={cn(
            "p-2 rounded-xl transition-all cursor-pointer",
            link.is_highlighted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
              : isLight
              ? "text-slate-500 hover:text-slate-900 bg-slate-100 border border-slate-200 hover:bg-slate-200"
              : "text-slate-500 hover:text-slate-300 bg-slate-900 border border-slate-800"
          )}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Edit Link */}
        <button
          onClick={() => onOpenEdit(link)}
          title="Edit Link"
          className={cn(
            "p-2 rounded-xl transition-colors cursor-pointer",
            isLight
              ? "text-slate-600 hover:text-slate-950 bg-slate-100 border border-slate-200 hover:bg-slate-200"
              : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
          )}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Link */}
        <button
          onClick={() => onDelete(link.id)}
          title="Delete Link"
          className={cn(
            "p-2 rounded-xl transition-colors cursor-pointer",
            isLight
              ? "text-slate-500 hover:text-red-500 bg-slate-100 border border-slate-200 hover:border-red-300 hover:bg-red-50"
              : "text-slate-500 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/40 hover:bg-red-500/10"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Active Switch */}
        <div className="pl-1">
          <Switch
            checked={link.is_active}
            onCheckedChange={() => onToggleStatus(link.id)}
          />
        </div>
      </div>
    </Reorder.Item>
  );
}

export function LinksTab() {
  const {
    links,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLinkStatus,
    toggleHighlight,
    uiTheme,
    language,
    t,
  } = useApp();
  const isLight = uiTheme === "light";

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Form State for Add / Edit
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Globe");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [hasScheduling, setHasScheduling] = useState(false);
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success && result.url) {
        setThumbnailUrl(result.url);
      }
    } catch {
      // Data URL remains valid
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setIcon("Globe");
    setThumbnailUrl("");
    setCategory("General");
    setIsHighlighted(false);
    setHasScheduling(false);
    setScheduledStart("");
    setScheduledEnd("");
    setEditingLink(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description || "");
    setIcon(link.icon || "Globe");
    setThumbnailUrl(link.thumbnail_url || "");
    setCategory(link.category || "General");
    setIsHighlighted(link.is_highlighted);
    setHasScheduling(Boolean(link.scheduled_start || link.scheduled_end));
    setScheduledStart(link.scheduled_start ? link.scheduled_start.substring(0, 16) : "");
    setScheduledEnd(link.scheduled_end ? link.scheduled_end.substring(0, 16) : "");
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    if (editingLink) {
      updateLink(editingLink.id, {
        title,
        url,
        description,
        icon,
        thumbnail_url: thumbnailUrl || undefined,
        category,
        is_highlighted: isHighlighted,
        scheduled_start: hasScheduling && scheduledStart ? scheduledStart : null,
        scheduled_end: hasScheduling && scheduledEnd ? scheduledEnd : null,
      });
    } else {
      addLink({
        title,
        url,
        description,
        icon,
        thumbnail_url: thumbnailUrl || undefined,
        category,
        is_active: true,
        is_highlighted: isHighlighted,
        scheduled_start: hasScheduling && scheduledStart ? scheduledStart : null,
        scheduled_end: hasScheduling && scheduledEnd ? scheduledEnd : null,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  // Filter links for display by category tab
  const filteredLinks = links.filter((link) => {
    if (activeCategory === "All") return true;
    return link.category === activeCategory;
  });

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...filteredLinks];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    if (activeCategory === "All") {
      reorderLinks(newOrder);
    } else {
      const otherLinks = links.filter((l) => l.category !== activeCategory);
      reorderLinks([...newOrder, ...otherLinks]);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index >= filteredLinks.length - 1) return;
    const newOrder = [...filteredLinks];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    if (activeCategory === "All") {
      reorderLinks(newOrder);
    } else {
      const otherLinks = links.filter((l) => l.category !== activeCategory);
      reorderLinks([...newOrder, ...otherLinks]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className={cn(
              "text-lg font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <span>{t("links_title")}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {links.length} {t("links_total")}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("links_desc")}
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={openAddModal}
          className="gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t("links_add_new")}
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div
        className={cn(
          "flex items-center gap-2 overflow-x-auto pb-2 border-b no-scrollbar transition-colors",
          isLight ? "border-slate-200" : "border-slate-800/80"
        )}
      >
        <span className="text-xs text-slate-500 flex items-center gap-1 pl-1 pr-2 shrink-0">
          <Layers className="w-3.5 h-3.5" /> {t("links_filter")}:
        </span>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer",
              activeCategory === cat
                ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20"
                : isLight
                ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Draggable Links List */}
      {filteredLinks.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={filteredLinks}
          onReorder={(newOrder) => {
            // If viewing All, directly apply reorder
            if (activeCategory === "All") {
              reorderLinks(newOrder);
            } else {
              // Apply reorder to full array preserving others
              const otherLinks = links.filter((l) => l.category !== activeCategory);
              reorderLinks([...newOrder, ...otherLinks]);
            }
          }}
          className="space-y-3"
        >
          {filteredLinks.map((link, index) => (
            <DraggableLinkItem
              key={link.id}
              link={link}
              index={index}
              total={filteredLinks.length}
              isLight={isLight}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onToggleHighlight={toggleHighlight}
              onOpenEdit={openEditModal}
              onDelete={deleteLink}
              onToggleStatus={toggleLinkStatus}
            />
          ))}
        </Reorder.Group>
      ) : (
        <div
          className={cn(
            "p-12 text-center rounded-2xl border transition-colors",
            isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3
            className={cn(
              "text-base font-semibold mb-1 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {t("links_empty_title")}
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            {t("links_empty_desc")}
          </p>
          <Button variant="neon" size="sm" onClick={openAddModal}>
            {t("links_add_new")}
          </Button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingLink ? t("links_modal_edit_title") : t("links_modal_create_title")}
        description={t("links_modal_desc")}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={`${t("links_field_title")} *`}
            placeholder={t("links_title_placeholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label={`${t("links_field_url")} *`}
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Input
            label={t("links_field_desc")}
            placeholder={t("links_desc_placeholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "block text-xs font-medium mb-1.5 transition-colors",
                  isLight ? "text-slate-700" : "text-slate-300"
                )}
              >
                {t("links_field_category")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(
                  "w-full border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:border-emerald-500/60",
                  isLight
                    ? "bg-white border-slate-200 text-slate-900"
                    : "bg-[#090d18] border-slate-800 text-slate-100"
                )}
              >
                {PRESET_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  className={cn(
                    "block text-xs font-medium transition-colors",
                    isLight ? "text-slate-700" : "text-slate-300"
                  )}
                >
                  {t("links_thumbnail_optional")}
                </label>
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className={cn(
                    "text-[11px] hover:underline flex items-center gap-1 cursor-pointer transition-colors",
                    isLight ? "text-emerald-600" : "text-emerald-400"
                  )}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{t("links_select_explorer")}</span>
                </button>
              </div>

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />

              <Input
                placeholder={t("links_thumbnail_placeholder")}
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Icon Selector with Full Picker & Search */}
          <div>
            <label
              className={cn(
                "block text-xs font-medium mb-2 transition-colors",
                isLight ? "text-slate-700" : "text-slate-300"
              )}
            >
              {t("links_field_icon")}
            </label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              isLight={isLight}
              language={language}
            />
          </div>

          {/* Highlight & Schedule Toggles */}
          <div
            className={cn(
              "p-4 rounded-xl border space-y-3 transition-colors",
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/40 border-slate-800"
            )}
          >
            <Switch
              label={t("links_highlight_neon")}
              description={t("links_highlight_neon_desc")}
              checked={isHighlighted}
              onCheckedChange={setIsHighlighted}
            />

            <div
              className={cn(
                "pt-2 border-t transition-colors",
                isLight ? "border-slate-200" : "border-slate-800/80"
              )}
            >
              <Switch
                label={t("links_schedule_pro")}
                description={t("links_schedule_pro_desc")}
                checked={hasScheduling}
                onCheckedChange={setHasScheduling}
              />

              {hasScheduling && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <span
                      className={cn(
                        "block text-[11px] mb-1 transition-colors",
                        isLight ? "text-slate-600" : "text-slate-400"
                      )}
                    >
                      {t("links_start_date")}
                    </span>
                    <input
                      type="datetime-local"
                      value={scheduledStart}
                      onChange={(e) => setScheduledStart(e.target.value)}
                      className={cn(
                        "w-full border rounded-xl p-2 text-xs transition-colors",
                        isLight
                          ? "bg-white border-slate-200 text-slate-900"
                          : "bg-[#080c14] border-slate-800 text-slate-200"
                      )}
                    />
                  </div>
                  <div>
                    <span
                      className={cn(
                        "block text-[11px] mb-1 transition-colors",
                        isLight ? "text-slate-600" : "text-slate-400"
                      )}
                    >
                      {t("links_end_date")}
                    </span>
                    <input
                      type="datetime-local"
                      value={scheduledEnd}
                      onChange={(e) => setScheduledEnd(e.target.value)}
                      className={cn(
                        "w-full border rounded-xl p-2 text-xs transition-colors",
                        isLight
                          ? "bg-white border-slate-200 text-slate-900"
                          : "bg-[#080c14] border-slate-800 text-slate-200"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className={isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : ""}
            >
              {t("links_btn_cancel")}
            </Button>
            <Button type="submit" variant="neon" size="sm">
              {editingLink ? t("links_btn_save_changes") : t("links_btn_create_action")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
