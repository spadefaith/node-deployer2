import table from './table';
import addForm from './add-form';
import editForm from './edit-form';
import filterForm from './filter-form';
import FormConstructor from '~/server/classes/Form';
export default {
	name: 'Accounts',
	layout: 'layout_1',
	link: '/accounts',

	components: {
		header: {
			brand: {
				display: '',
				link: '/',
				icon: 'brand.png',
				ref_name: 'brand'
			},
			items: [
				{
					display: 'Profile',
					link: '/profile',
					icon: '',
					ref_name: 'profile'
				},
				{
					display: 'Logout',
					link: '/logout',
					icon: '',
					ref_name: 'logout'
				},
				{
					display: '',
					link: '/burger',
					icon: 'burger.png',
					ref_name: 'menu'
				}
			]
		},
		table: {
			column: table
		},
		filter: {
			items: filterForm
		},
		tab: {
			items: [
				{
					display: 'Admin',
					ref_name: 'admin',
					link: '/users',
					id: 1,
					icon: ' fa-user-shield'
				},
				{
					display: 'Web Agent',
					ref_name: 'web_agent',
					link: '/users?type=web_agent',
					id: 2,
					icon: 'fa-user-tie'
				},
				{
					display: 'Mobile Agent',
					ref_name: 'mobile_agent',
					link: '/users?type=mobile_agent',
					id: 2,
					icon: 'fa-user-tie'
				},
				{
					display: 'Sub Agents',
					ref_name: 'sub_agent',
					link: '/users?type=sub_agent',
					id: 3,
					icon: 'fa-id-badge'
				}
			]
		},
		form: {
			add: addForm,
			edit: editForm
		}
	}
};
