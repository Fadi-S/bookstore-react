import {CreditCardIcon} from "@heroicons/react/20/solid";
import {loadStripe} from '@stripe/stripe-js';
import {useCreateSetupIntentMutation, useFinishSetupIntentMutation} from "../features/orders/stripe_slice";
import {createRef, useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../app/hooks";
import {notify} from "../app/helpers";


const stripeAPI = process.env.REACT_APP_STRIPE_API_KEY;
const stripePromise = loadStripe(stripeAPI);

export default function StripeSetup({onSuccess}) {
    const [createSetupIntent, {data: setupIntentData, isSuccess: isIntentSuccess}] = useCreateSetupIntentMutation();
    const [finishSetupIntent, {isSuccess: hasFinishedSuccessfully, isLoading: isLoadingFinish, error: finishSetupError, data: finishSetupData}] = useFinishSetupIntentMutation();

    const initialized = createRef(false);

    useEffect( () => {
        if (!initialized.current) {
            createSetupIntent();
            initialized.current = true;
        }
    }, []);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (hasFinishedSuccessfully) {
            onSuccess(finishSetupData.payment_method_id);

            notify("Card saved successfully", dispatch);
        } else if(finishSetupError) {
            notify(finishSetupError, dispatch, "Error saving card", "error");
            console.error(finishSetupError);
        }
    }, [hasFinishedSuccessfully]);

    const [setupIntent, setSetupIntent] = useState(null);

    let elements = useRef(null);

    useEffect(() => {
        if (isIntentSuccess) {
            stripePromise.then((stripe) => {
                setSetupIntent(setupIntentData);

                elements.current = stripe.elements({
                    clientSecret: setupIntentData.client_secret,
                    loader: 'auto'
                });

                const element = elements.current.create('payment', {
                    layout: 'tabs',
                });

                element.mount('#payment-element');
            });
        }
    }, [isIntentSuccess]);


    const saveCard = async (event) => {
        event.preventDefault();

        const stripe = await stripePromise;

        const result = await stripe.confirmSetup({
            elements: elements.current,
            redirect: 'if_required',
            confirmParams: {
                return_url: 'http://localhost:3000/checkout',
            },
        });

        if (result.error) {
            notify(result.error.message, dispatch, "Error saving card", "error");
        } else {
            finishSetupIntent(result.setupIntent.id);
        }
    };

    return (
        <div className="bg-white shadow rounded px-6 py-8">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Payment Information</h2>
            <form className="mt-4" onSubmit={saveCard}>
                <div id="payment-element"></div>

                <button
                    type="submit"
                    disabled={!setupIntent || isLoadingFinish}
                    className="disabled:bg-gray-600 mt-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <CreditCardIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
                    {isLoadingFinish ? "Saving..." : "Save Card"}
                </button>
            </form>
        </div>
    );
}