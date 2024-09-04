import {StarIcon} from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Rating(props) {
    return (
        <div className="flex items-center">
            {
                [0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                            (props.rating) > rating ? 'text-indigo-500' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0',
                        )}
                    />
                ))
            }
        </div>
    );
}