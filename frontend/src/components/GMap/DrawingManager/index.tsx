import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export function useDrawingManager(
    initialValue: google.maps.drawing.DrawingManager | null = null
) {
    const map = useMap();
    const drawing = useMapsLibrary("drawing");

    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(initialValue);

    useEffect(() => {
        if(!map || !drawing) return;

        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingMode: google.maps.drawing.OverlayType.CIRCLE,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition
            }
        })
    }, []);
};