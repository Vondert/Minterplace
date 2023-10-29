use anchor_lang::prelude::{*};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::{
    types::{DataV2, Creator}, 
    accounts::Metadata as MetaplexMetadata, 
    accounts::MasterEdition
};
declare_id!("DzgHfmRkctH9W7d65vgxNPra2UqjWACBGZY1kFPMRy13");

#[program]
pub mod minterplace_program {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNFT>, name: String, symbol: String, uri: String, seller_fee_basis_points: u16) -> Result<()> {
        //Creating mint context
        let mint_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.signer_ata.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        );
        //Token program cpi for mint
        mint_to(mint_context, 1)?;
        
        //Creating metadata context
        let metadata_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );
        //Creating data struct
        let data = DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points,
            creators: Some(vec![Creator{address: ctx.accounts.signer.key(), verified: true, share: 100}]),
            collection: None,
            uses: None,
        };
        //Token metadata program cpi for initializing metadata account
        create_metadata_accounts_v3(metadata_context, data, false, true, None)?;
        //Creating master context
        let master_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.master_edition.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );
        //Token metadata program cpi for initializing master edition account
        create_master_edition_v3(master_context, None)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 0,
        mint::authority = signer.key(),
        mint::freeze_authority = signer.key(),
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub signer_ata: Account<'info, TokenAccount>,

    /// CHECK - address
    #[account(
        mut,
        address=MetaplexMetadata::find_pda(&mint.key()).0,
    )]
    pub metadata: AccountInfo<'info>,

    /// CHECK - address
    #[account(
        mut,
        address=MasterEdition::find_pda(&mint.key()).0,
    )]
    pub master_edition: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>, // new
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
