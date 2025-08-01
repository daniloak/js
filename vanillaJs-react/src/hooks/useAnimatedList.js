import { useCallback, useState, useRef, createRef, useEffect } from 'react';

export default function useAnimatedList(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const [pendingRemovalItemsIds, setPendingRemovalItemsIds] = useState([]);

  const animatedRefs = useRef(new Map());
  const animationEndListeners = useRef(new Map());

  const handleAnimationEnd = useCallback((itemId) => {
    const removeListener = animationEndListeners.current.get(itemId);
    removeListener();

    animationEndListeners.current.delete(itemId);
    animatedRefs.current.delete(itemId);

    setItems((prevState) => prevState.filter((item) => item.id !== itemId));
    setPendingRemovalItemsIds((prevState) =>
      prevState.filter((id) => id !== itemId)
    );
  }, []);

  useEffect(() => {
    pendingRemovalItemsIds.forEach((itemId) => {
      const animatedRef = animatedRefs.current.get(itemId);
      const alreadyHasListener = animationEndListeners.current.has(itemId);
      const animatedElement = animatedRef?.current;

      if (animatedElement && !alreadyHasListener) {
        const onAnimationEnd = () => handleAnimationEnd(itemId);
        const removeListener = () => {
          animatedElement.removeEventListener('animationend', onAnimationEnd);
        };

        animatedElement.addEventListener('animationend', onAnimationEnd);
        animationEndListeners.current.set(itemId, removeListener);
      }
    });
  }, [pendingRemovalItemsIds, handleAnimationEnd]);

  useEffect(() => {
    const removeListeners = animationEndListeners.current;
    return () => {
      removeListeners.forEach((removeListener) => {
        removeListener();
      });
    };
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setPendingRemovalItemsIds((prevState) => [...prevState, id]);
  }, []);

  const getAnimatedRef = useCallback((itemId) => {
    let animatedRef = animatedRefs.current.get(itemId);
    if (!animatedRef) {
      animatedRef = createRef();
      animatedRefs.current.set(itemId, animatedRef);
    }
    return animatedRef;
  }, []);

  const renderList = useCallback(
    (renderItem) =>
      items.map((item) => {
        const isLeaving = pendingRemovalItemsIds.includes(item.id);
        const animatedRef = getAnimatedRef(item.id);
        return renderItem(item, {
          isLeaving,
          animatedRef,
        });
      }),
    [items, pendingRemovalItemsIds, getAnimatedRef]
  );

  return {
    items,
    setItems,
    handleRemoveItem,
    renderList,
  };
}

// const animatedElementRef = useRef(null);

// useEffect(() => {
//   const elementRef = animatedElementRef.current;
//   function handleAnimationEnd() {
//     onAnimationEnd(message.id);
//   }

//   if ($isLeaving && elementRef) {
//     elementRef.addEventListener('animationend', handleAnimationEnd);
//   }

//   return () => {
//     elementRef.removeEventListener('animationend', handleAnimationEnd);
//   };
// }, [$isLeaving, message.id, onAnimationEnd]);
