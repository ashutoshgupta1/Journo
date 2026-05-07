import { useEffect } from 'react';

export function useDraggable(itemRef, containerRef, onDrop) {
  useEffect(() => {
    const item = itemRef.current;
    const container = containerRef.current;
    if (!item || !container) return undefined;

    let dragging = false;
    let originX = 0;
    let originY = 0;

    const onMouseDown = (event) => {
      dragging = true;
      const rect = item.getBoundingClientRect();
      originX = event.clientX - rect.left;
      originY = event.clientY - rect.top;
      item.style.zIndex = 20;
      event.preventDefault();
    };

    const onMouseMove = (event) => {
      if (!dragging) return;
      const parent = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - parent.left - originX, parent.width - item.offsetWidth));
      const y = Math.max(0, Math.min(event.clientY - parent.top - originY, parent.height - item.offsetHeight));
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.right = 'auto';
      item.style.bottom = 'auto';
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      item.style.zIndex = 5;
      onDrop?.({ left: item.style.left, top: item.style.top });
    };

    item.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      item.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [containerRef, itemRef, onDrop]);
}
