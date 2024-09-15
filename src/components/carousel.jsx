import React, {useCallback, useState, useEffect} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from "embla-carousel-autoplay";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/solid";
import {WheelGesturesPlugin} from "embla-carousel-wheel-gestures";
import ClassNames from "embla-carousel-class-names";

export function Carousel({children, className}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
    }, [
        Autoplay({ playOnInit: true, delay: 5000 }),
        WheelGesturesPlugin(),
        ClassNames({
            dragging: 'cursor-grabbing',
            draggable: 'cursor-grab',
        })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)


    return (
        <div className="embla flex items-center justify-between relative select-none">
            <button type="button" onClick={scrollPrev}
                    className="embla__prev absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
                <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <ChevronLeftIcon className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"/>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <div className={"embla__viewport " + className} ref={emblaRef}>
                <div className="embla__container space-x-6">
                    {children}
                </div>
            </div>
            <button type="button" onClick={scrollNext}
                    className="embla__next absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none">
                <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <ChevronRightIcon className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"/>
                    <span className="sr-only">Next</span>
                </span>
            </button>

            <div className="embla__dots absolute bottom-4 right-8">
                {scrollSnaps.map((_, index) => (
                    <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        className={'embla__dot'.concat(
                            index === selectedIndex ? ' embla__dot--selected' : ''
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

export function CarouselItem({children}) {
    return <div className="embla__slide max-w-">
        <div className="" tabIndex={-1}>
            {children}
        </div>
    </div>
}

export const useDotButton = (emblaApi, onButtonClick) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState([])

    const onDotButtonClick = useCallback(
        (index) => {
            if (!emblaApi) return
            emblaApi.scrollTo(index)
            if (onButtonClick) onButtonClick(emblaApi)
        },
        [emblaApi, onButtonClick]
    )

    const onInit = useCallback((emblaApi) => {
        setScrollSnaps(emblaApi.scrollSnapList())
    }, [])

    const onSelect = useCallback((emblaApi) => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onInit(emblaApi)
        onSelect(emblaApi)

        emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onInit, onSelect])

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    }
}

export const DotButton = (props) => {
    const { children, ...restProps } = props

    return (
        <button type="button" {...restProps}>
            {children}
        </button>
    )
}