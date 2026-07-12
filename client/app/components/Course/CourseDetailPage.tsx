import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useEffect, useState } from "react";
import { Loader } from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseDetails from "./CourseDetails";

import Header from "../Header";
import Footer from "../Footer";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/order/orderApi";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
type Props = {
  id: string;
};
const CourseDetailPage: FC<Props> = ({ id }) => {
  const [route, setRoute] = useState("");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishableKeyQuery({});
  const [
    createPaymentIntent,
    { data: paymentIntentData, isLoading: isConfigLoading },
  ] = useCreatePaymentIntentMutation();
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    if (config) {
      const publishAbleKey = config?.publishablekey;
      setStripePromise(loadStripe(publishAbleKey));
    }
    if (data) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount);
    }
  }, [config, data]);
  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading || isConfigLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + "-" + "SkillStack"}
            description="SkillStack is a platform for students to learn and get help from teachers"
            keywords={data?.course.tags}
          />
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            setRoute={setRoute}
            route={route}
          />

          <CourseDetails
            data={data.course}
            stripePromise={stripePromise}
            clientSecret={clientSecret}
            setOpen={setOpen}
            setRoute={setRoute}
          />

          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailPage;
