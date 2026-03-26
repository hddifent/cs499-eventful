<script module lang="ts">
	import MdiEmail from 'virtual:icons/mdi/email';
	import MdiUser from 'virtual:icons/mdi/account';
	import MdiUserDisp from 'virtual:icons/mdi/account-arrow-right';
	import MdiLock from 'virtual:icons/mdi/lock';
	import MdiLockCheck from 'virtual:icons/mdi/lock-check';

	import MdiOrgUnique from 'virtual:icons/mdi/account-group';
	import MdiOrgDisp from 'virtual:icons/mdi/account-group-outline';

	import MdiEvent from 'virtual:icons/mdi/calendar';
	import MdiDescription from 'virtual:icons/mdi/format-list-bulleted';
	import MdiLocation from 'virtual:icons/mdi/map-marker';
	import MdiLink from 'virtual:icons/mdi/link-variant';
	import MdiDate from 'virtual:icons/mdi/calendar-clock';
	import MdiTime from 'virtual:icons/mdi/clock';
	import MdiDay from 'virtual:icons/mdi/calendar-badge';

	export {
		emailLabel,
		usernameLabel,
		displayNameLabel,
		passwordLabel,
		confirmPasswordLabel,
		orgUniqueNameLabel,
		orgDisplayNameLabel,
		eventNameLabel,
		eventDescriptionLabel,
		eventLocationLabel,
		eventApplyLinkLabel,
		applicationDateLabel,
		eventDaysTimeLabel,
		eventDaysLabel
	};
</script>

{#snippet emailLabel()}
	<MdiEmail /> Email
{/snippet}

{#snippet usernameLabel()}
	<MdiUser /> Username
{/snippet}

{#snippet displayNameLabel()}
	<MdiUserDisp /> Display Name
{/snippet}

{#snippet passwordLabel()}
	<MdiLock /> Password
{/snippet}

{#snippet confirmPasswordLabel()}
	<MdiLockCheck /> Confirm Password
{/snippet}

{#snippet orgUniqueNameLabel()}
	<MdiOrgUnique /> Group Unique Name
{/snippet}

{#snippet orgDisplayNameLabel()}
	<MdiOrgDisp /> Group Display Name
{/snippet}

{#snippet eventNameLabel()}
	<MdiEvent /> Event Name
{/snippet}

{#snippet eventDescriptionLabel()}
	<MdiDescription /> Description
{/snippet}

{#snippet eventLocationLabel()}
	<MdiLocation /> Location
{/snippet}

{#snippet eventApplyLinkLabel()}
	<MdiLink /> Application Form Link
{/snippet}

{#snippet applicationDateLabel()}
	<MdiDate /> Application Period
{/snippet}

{#snippet eventDaysTimeLabel(index: number)}
	<MdiTime /> Day {index}
{/snippet}

{#snippet eventDaysLabel()}
	<MdiDay /> Event Days
{/snippet}
