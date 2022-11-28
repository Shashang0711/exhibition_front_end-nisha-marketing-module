import React, { useEffect, useState } from 'react';
import faq from "../../assets/images/faq.png";
import { FaqService } from '../../services/faq';
import back_arrow from '../../assets/images/icon/back-arrow.svg'

const Faq = (props) => {
  const [faqList, setFaqList] = useState([]);
  useEffect(() => {
    fetchFaqData()
    
  }, [])

  const fetchFaqData = async () => {
    const faqRes = await FaqService.getFaq()
    if (!faqRes) {
      return;
    }
    if (faqRes.status === 200 || faqRes.status === '200') {
      props.loaderClose();
      setFaqList(faqRes.data)
    }

  }

  return (
    <div className="tab-pane fade" id="faq" role="tabpanel" aria-labelledby="faq-tab" tabIndex="0">
      <div className="faq">
        <div className="faq-header">
          <div className="back">
            <button><img src={back_arrow} alt="Back" onClick={props.backHandler} /></button>
          </div>
          <div className="faq-inner">
            <div className="img-wrapper">
              <img src={faq} alt="Imagefaq" />
            </div>
            <div className="details">
              <div className="name">FAQ</div>
              <div className="sub-name">We’re happy to help</div>
            </div>
          </div>
        </div>
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {faqList.map((element, index) =>
            <React.Fragment key={index}>
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target={"#flush-collapse" + index} aria-expanded="false"
                    aria-controls={"flush-collapse" + index}>
                    {element.question}
                  </button>
                </h2>
                <div id={"flush-collapse" + index} className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">{element.answer}</div>
                </div>
              </div>
            </React.Fragment>
          )
          }

        </div>
      </div>
    </div>
  )
}

export default Faq