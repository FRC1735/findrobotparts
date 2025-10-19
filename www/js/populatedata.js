/** ===== Utilities ===== **/
const escapeHTML = (s='') =>
	s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const rand = (len=6) => {
	if (window.crypto && crypto.getRandomValues) {
		const arr = new Uint32Array(2);
		crypto.getRandomValues(arr);
		return (arr[0].toString(36) + arr[1].toString(36)).slice(0, len);
	}
	return Math.random().toString(36).slice(2, 2+len);
};

const idPrefix = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'x';

const makeCheckboxId = (groupName) => `${idPrefix(groupName)}-${Math.floor(1000 + Math.random()*9000)}`;

/** ===== Core builder ===== **/
function buildUI(data) {
	const contentEl = document.querySelector('#content');
	const sidebarEl = document.querySelector('#sidebar');
	if (!contentEl || !sidebarEl) return;

	// 1) Collect distinct options per filter group + Vendors
	const filterGroups = [...data.filter_groups]; // e.g., ["Type","ID","OD","Shield","Width"]
	const optionIdMap = new Map(); // Map<groupName, Map<optionLabel, checkboxId>>
	filterGroups.forEach(g => optionIdMap.set(g, new Map()));
	optionIdMap.set('Vendors', new Map()); // derived

	for (const p of data.products) {
		// filter options
		for (const group of filterGroups) {
			const values = (p.filters?.[group] || []).map(String);
			const mapForGroup = optionIdMap.get(group);
			for (const valRaw of values) {
				const val = valRaw.trim();
				if (!mapForGroup.has(val)) {
					mapForGroup.set(val, makeCheckboxId(group));
				}
			}
		}
		// vendors
		for (const link of (p.links || [])) {
			const vendor = (link.vendor || '').trim();
			if (vendor) {
				const mapForVendors = optionIdMap.get('Vendors');
				if (!mapForVendors.has(vendor)) {
					mapForVendors.set(vendor, makeCheckboxId('vendors'));
				}
			}
		}
	}

	// 2) Build TABLE
	const table = document.createElement('table');
	table.id = 'productdata';
	table.className = 'table table-striped table-collapse';

	// thead
	const thead = document.createElement('thead');
	thead.innerHTML = `<tr>
		<th scope="col">Product</th>
		${filterGroups.map(g => `<th>${escapeHTML(g)}</th>`).join('')}
		<th>Vendors</th>
	</tr>`;
	table.appendChild(thead);

	// tbody
	const tbody = document.createElement('tbody');

	for (const p of data.products) {
		const tr = document.createElement('tr');

		// Add classes for every selected option (including vendors)
		for (const group of filterGroups) {
			const values = (p.filters?.[group] || []);
			for (const v of values) {
				const idForOption = optionIdMap.get(group).get(v.trim());
				if (idForOption) tr.classList.add(idForOption);
			}
		}
		for (const link of (p.links || [])) {
			const vname = (link.vendor || '').trim();
			const idForVendor = optionIdMap.get('Vendors').get(vname);
			if (idForVendor) tr.classList.add(idForVendor);
		}

		// Product cell
		const productImg = (p.image || '').trim();
		const productName = (p.name || '').trim();
		const productCell = document.createElement('th');
		productCell.scope = 'row';
		productCell.setAttribute('data-label', 'Product');
		productCell.innerHTML =
			`<strong>${escapeHTML(productName)}</strong><br>` +
			(productImg ? `<img src="${escapeHTML(productImg)}" class="img-thumbnail" alt="${escapeHTML(productName)}">` : '');
		tr.appendChild(productCell);

		// Filter cells (with collapses)
		for (const group of filterGroups) {
			const values = (p.filters?.[group] || []).map(String);
			const td = document.createElement('td');
			td.setAttribute('data-label', group);
			const collapseId = `tg-${rand(8)}`;
			const htmlList = values.map(v => escapeHTML(v)).join('<br>') || '&nbsp;';
			td.innerHTML = `
				<div class="tags collapse" id="${collapseId}">${htmlList}</div>
				<a class="showmore collapsed d-none" data-bs-toggle="collapse" href="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
					Show <span class="more">more</span> <span class="less">less</span>
				</a>
			`;
			// Only show the toggle if there are many items (e.g., >3)
			if (values.length > 3) {
				td.querySelector('.showmore')?.classList.remove('d-none');
			}
			tr.appendChild(td);
		}

		// Vendors cell
		const vendorsTd = document.createElement('td');
		vendorsTd.setAttribute('data-label', 'Vendors');
		const links = p.links || [];
		if (links.length) {
			const lg = document.createElement('div');
			lg.className = 'list-group';
			for (const {vendor, link} of links) {
				if (!vendor || !link) continue;
				const a = document.createElement('a');
				a.href = link;
				a.target = '_blank';
				a.className = 'list-group-item list-group-item-action list-group-item-green';
				a.textContent = vendor;
				lg.appendChild(a);
			}
			vendorsTd.appendChild(lg);
		} else {
			vendorsTd.innerHTML = '&nbsp;';
		}
		tr.appendChild(vendorsTd);

		tbody.appendChild(tr);
	}

	table.appendChild(tbody);

	// 3) Inject TABLE into #content
	contentEl.innerHTML = '';
	contentEl.appendChild(table);

	// 4) Build SIDEBAR
	const sidebarRow = document.createElement('div');
	sidebarRow.className = 'row';

	const buildGroup = (groupName) => {
		const col = document.createElement('div');
		col.className = 'col-6 col-sm-12';

		const prettyName = escapeHTML(groupName);
		const aria = `${prettyName} options`;

		const map = optionIdMap.get(groupName);
		const entries = [...map.entries()]; // [ [label, id], ... ]

		// Sort labels naturally-ish
		entries.sort((a,b)=> a[0].localeCompare(b[0], undefined, {numeric:true, sensitivity:'base'}));

		const needsShowAll = entries.length > 6; // heuristic
		col.innerHTML = `
			<p class="h6 mt-4">${prettyName}</p>
			<div class="btn-group-vertical btn-group-sm full-width" role="group" aria-label="${aria}">
				${entries.map(([label, id]) => `
					<input type="checkbox" class="btn-check" id="${id}" value="${id}" autocomplete="off">
					<label class="btn btn-outline-green" for="${id}">${escapeHTML(label)}</label>
				`).join('')}
				<button type="button" class="btn btn-outline-green ${needsShowAll ? '' : 'd-none'}">Show <span class="all">All</span><span class="less">Less</span></button>
			</div>
		`;
		return col;
	};

	// Add all filter groups
	for (const g of filterGroups) {
		sidebarRow.appendChild(buildGroup(g));
	}
	// Add Vendors group at the end
	sidebarRow.appendChild(buildGroup('Vendors'));

	// Inject SIDEBAR into #sidebar
	sidebarEl.innerHTML = '';
	sidebarEl.appendChild(sidebarRow);
}
buildUI(data);
