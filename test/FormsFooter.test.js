import { mount} from "@vue/test-utils";
import FormsFooter from "@/components/FormsFooter"

describe("FormsFooter", () => {
    it('renders correctly', () => {
        const wrapper = mount(FormsFooter)
        expect(wrapper.element).toMatchSnapshot()
      })
})

