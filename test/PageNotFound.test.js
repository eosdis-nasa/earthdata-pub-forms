import { mount} from "@vue/test-utils";
import PageNotFound from "@/components/PageNotFound"

describe("PageNotFound", () => {
    it('renders correctly', () => {
        const wrapper = mount(PageNotFound)
        expect(wrapper.element).toMatchSnapshot()
      })
})